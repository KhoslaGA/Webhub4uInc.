#!/usr/bin/env python3
"""Bounded, read-only audit of sitemap HTML. Python 3.10+, no dependencies."""
import argparse
import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser
from xml.etree import ElementTree as ET

AGENT = 'Webhub4U-SEO-Audit/1.0'
LIMIT = 4_000_000

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_title = False
        self.title = ''
        self.canonicals = []
        self.description = ''
        self.robots = []
        self.h1 = 0
        self.image_count = 0
        self.missing_alt = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title': self.in_title = True
        if tag == 'h1': self.h1 += 1
        if tag == 'link' and 'canonical' in a.get('rel', '').lower().split():
            self.canonicals.append(a.get('href', ''))
        if tag == 'meta':
            name = a.get('name', '').lower()
            if name == 'description': self.description = a.get('content', '')
            if name in ('robots', 'googlebot'): self.robots.append(a.get('content', '').lower())
        if tag == 'img':
            self.image_count += 1
            if 'alt' not in a: self.missing_alt += 1
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
    def handle_data(self, data):
        if self.in_title: self.title += data

def fetch(url):
    request = Request(url, headers={'User-Agent': AGENT, 'Accept': 'text/html,application/xml,text/plain'})
    with urlopen(request, timeout=20) as response:
        data = response.read(LIMIT + 1)
        if len(data) > LIMIT: raise ValueError('Response exceeds 4 MB audit limit')
        return response.status, response.url, dict(response.headers), data.decode('utf-8', 'replace')

def normalized(url):
    p = urlsplit(url)
    return (p.scheme, p.netloc.lower(), p.path.rstrip('/') or '/', p.query)

def inspect_page(html, expected, status=200, headers=None):
    page = Page(); page.feed(html)
    errors, warnings = [], []
    if status != 200: errors.append(f'HTTP {status}')
    if not page.title.strip(): errors.append('Missing title')
    if not page.description.strip(): errors.append('Missing meta description')
    if len(page.canonicals) != 1: errors.append(f'Expected one canonical, found {len(page.canonicals)}')
    elif normalized(urljoin(expected, page.canonicals[0])) != normalized(expected):
        errors.append(f'Canonical mismatch: {page.canonicals[0]}')
    directives = ','.join(page.robots + [v.lower() for k,v in (headers or {}).items() if k.lower() == 'x-robots-tag'])
    if re.search(r'\b(?:noindex|none)\b', directives):
        errors.append('Sitemap page has noindex')
    if page.h1 != 1: warnings.append(f'Expected one H1, found {page.h1}')
    if page.missing_alt: warnings.append(f'{page.missing_alt} images lack an alt attribute')
    return {'url': expected, 'title': page.title.strip(), 'canonical': page.canonicals, 'h1_count': page.h1, 'errors': errors, 'warnings': warnings}

def run(base, canonical, max_pages):
    base, canonical = base.rstrip('/'), canonical.rstrip('/')
    allowed_hosts = {urlsplit(canonical).netloc, urlsplit(base).netloc}
    root = urlsplit(canonical).hostname or ''
    allowed_hosts.add(root.removeprefix('www.'))
    allowed_hosts.add('www.' + root.removeprefix('www.'))
    report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'fetch_origin': base, 'canonical_origin': canonical, 'scope': 'Sitemap pages, initial HTML only. Does not measure indexing, rankings, links outside the sitemap or Core Web Vitals.', 'site_errors': [], 'pages': []}
    robots = RobotFileParser()
    try:
        _, _, _, text = fetch(base + '/robots.txt')
        robots.parse(text.splitlines())
        if canonical + '/sitemap.xml' not in (robots.site_maps() or []):
            report['site_errors'].append('robots.txt does not reference the canonical sitemap URL')
    except (HTTPError, URLError, ValueError, TimeoutError) as exc:
        report['site_errors'].append(f'Could not read robots.txt: {exc}')
        return report
    def mapped(url):
        p = urlsplit(url)
        if p.scheme not in ('http', 'https') or p.netloc not in allowed_hosts:
            raise ValueError(f'Skipping out-of-scope URL: {url}')
        if p.query or p.fragment: raise ValueError(f'Sitemap URL has query/fragment: {url}')
        return base + (p.path or '/')
    pending, seen_maps, urls = [canonical + '/sitemap.xml'], set(), []
    try:
        while pending:
            current = pending.pop(0)
            if current in seen_maps: continue
            if len(seen_maps) >= 20: raise ValueError('Sitemap count exceeds limit of 20')
            seen_maps.add(current)
            _, _, _, xml = fetch(mapped(current))
            doc = ET.fromstring(xml)
            locations = [e.text.strip() for e in doc.iter() if e.tag.split('}')[-1] == 'loc' and e.text]
            if doc.tag.split('}')[-1] == 'sitemapindex': pending.extend(locations)
            elif doc.tag.split('}')[-1] == 'urlset': urls.extend(locations)
            else: raise ValueError('Unknown sitemap format')
            if len(urls) > max_pages: raise ValueError(f'Sitemap exceeds configured {max_pages}-page limit; increase explicitly')
    except (HTTPError, URLError, ValueError, TimeoutError, ET.ParseError) as exc:
        report['site_errors'].append(f'Sitemap discovery failed: {exc}')
        return report
    if not urls: report['site_errors'].append('Sitemap has no URLs')
    if len(set(urls)) != len(urls): report['site_errors'].append('Duplicate sitemap URLs')
    for url in dict.fromkeys(urls):
        expected = canonical + (urlsplit(url).path or '/')
        errors = []
        if normalized(url) != normalized(expected): errors.append(f'Sitemap URL uses wrong origin: {url}')
        try:
            target = mapped(url)
            if not robots.can_fetch(AGENT, target): raise ValueError('robots.txt disallows this page')
            status, final_url, headers, html = fetch(target)
            row = inspect_page(html, expected, status, headers)
            if normalized(final_url) != normalized(target): row['errors'].append(f'Sitemap page redirects to {final_url}')
            if not any(k.lower() == 'content-type' and 'text/html' in v.lower() for k,v in headers.items()):
                row['errors'].append('Sitemap page is not HTML')
            row['errors'].extend(errors)
        except (HTTPError, URLError, ValueError, TimeoutError) as exc:
            row = {'url': expected, 'title': '', 'errors': errors + [f'Fetch failed: {exc}'], 'warnings': []}
        report['pages'].append(row)
    titles = Counter(p['title'].casefold() for p in report['pages'] if p['title'])
    for page in report['pages']:
        if page['title'] and titles[page['title'].casefold()] > 1: page['errors'].append('Duplicate title')
    return report

def audit_build(directory, canonical, max_pages):
    """Validate prerendered HTML without requiring a local network server."""
    root = Path(directory).resolve()
    canonical = canonical.rstrip('/')
    report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'mode': 'prerendered_build', 'canonical_origin': canonical, 'scope': 'Prerendered sitemap pages only. Does not verify HTTP behavior, dynamic pages, indexing, rankings or Core Web Vitals.', 'site_errors': [], 'pages': []}
    try:
        robots = RobotFileParser()
        robots.parse((root / 'robots.txt.body').read_text().splitlines())
        if canonical + '/sitemap.xml' not in (robots.site_maps() or []):
            report['site_errors'].append('robots.txt does not reference the canonical sitemap URL')
        xml = ET.fromstring((root / 'sitemap.xml.body').read_text())
        if xml.tag.split('}')[-1] != 'urlset':
            raise ValueError('Build mode expects a single urlset sitemap')
        urls = [e.text.strip() for e in xml.iter() if e.tag.split('}')[-1] == 'loc' and e.text]
        if not urls or len(urls) > max_pages:
            raise ValueError('Empty sitemap or configured page limit exceeded')
        if len(set(urls)) != len(urls): report['site_errors'].append('Duplicate sitemap URLs')
    except (OSError, ValueError, ET.ParseError) as exc:
        report['site_errors'].append(f'Build discovery failed: {exc}')
        return report
    for url in dict.fromkeys(urls):
        route = urlsplit(url).path or '/'
        expected = canonical + route
        try:
            if not robots.can_fetch(AGENT, url): raise ValueError('robots.txt disallows this page')
            path = (root / ('index.html' if route == '/' else route.lstrip('/') + '.html')).resolve()
            path.relative_to(root)
            row = inspect_page(path.read_text(), expected)
            if normalized(url) != normalized(expected): row['errors'].append(f'Sitemap URL uses wrong origin: {url}')
        except (OSError, ValueError) as exc:
            row = {'url': expected, 'title': '', 'errors': [f'Build HTML unavailable: {exc}'], 'warnings': []}
        report['pages'].append(row)
    titles = Counter(p['title'].casefold() for p in report['pages'] if p['title'])
    for page in report['pages']:
        if page['title'] and titles[page['title'].casefold()] > 1: page['errors'].append('Duplicate title')
    return report

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', default='https://www.webhub4u.com')
    parser.add_argument('--canonical-origin', default='https://www.webhub4u.com')
    parser.add_argument('--max-pages', type=int, default=100)
    parser.add_argument('--build-dir', help='Inspect Next.js prerendered artifacts, e.g. .next/server/app')
    parser.add_argument('--output', default='reports/seo-audit.json')
    args = parser.parse_args()
    if args.max_pages < 1 or args.max_pages > 500: parser.error('--max-pages must be 1 to 500')
    for value in (args.base, args.canonical_origin):
        p = urlsplit(value)
        if p.scheme not in ('http', 'https') or not p.netloc or p.path not in ('', '/') or p.query or p.fragment:
            parser.error('Origins must be http(s) origins without paths, queries or fragments')
    report = audit_build(args.build_dir, args.canonical_origin, args.max_pages) if args.build_dir else run(args.base, args.canonical_origin, args.max_pages)
    count = len(report['site_errors']) + sum(len(p['errors']) for p in report['pages'])
    warnings = sum(len(p['warnings']) for p in report['pages'])
    report['error_count'], report['warning_count'] = count, warnings
    output = Path(args.output); output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + '\n')
    print(f"Audited {len(report['pages'])} sitemap pages: {count} errors, {warnings} warnings. Report: {output}")
    for error in report['site_errors']: print('ERROR:', error)
    for page in report['pages']:
        for error in page['errors']: print('ERROR:', page['url'], error)
    return 1 if count else 0

if __name__ == '__main__': sys.exit(main())
