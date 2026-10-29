import unittest
from seo_audit import inspect_page, audit_build
import tempfile

URL = 'https://www.webhub4u.com/projects'
GOOD = '<title>Our work</title><meta name="description" content="Work"><link rel="canonical" href="https://www.webhub4u.com/projects"><h1>Work</h1>'

class AuditTests(unittest.TestCase):
    def test_valid_and_decorative_image(self):
        result = inspect_page(GOOD + '<img src="decorative.png" alt="">', URL)
        self.assertEqual(result['errors'], [])
        self.assertEqual(result['warnings'], [])
    def test_cross_host_canonical_is_rejected(self):
        result = inspect_page(GOOD.replace('www.webhub4u.com', 'webhub4u.com'), URL)
        self.assertTrue(any('Canonical mismatch' in e for e in result['errors']))
    def test_noindex_header_and_meta_are_rejected(self):
        self.assertIn('Sitemap page has noindex', inspect_page(GOOD, URL, headers={'X-Robots-Tag':'noindex'})['errors'])
        self.assertIn('Sitemap page has noindex', inspect_page(GOOD + '<meta name="robots" content="noindex, follow">', URL)['errors'])
    def test_missing_metadata_does_not_pass(self):
        result = inspect_page('<h1>Work</h1>', URL)
        self.assertEqual(len(result['errors']), 3)
    def test_script_text_cannot_fake_markup(self):
        result = inspect_page('<script>const t = "<title>Fake</title>";</script><h1>Work</h1>', URL)
        self.assertIn('Missing title', result['errors'])
    def test_missing_build_is_not_a_clean_audit(self):
        with tempfile.TemporaryDirectory() as directory:
            result = audit_build(directory, 'https://www.webhub4u.com', 100)
            self.assertTrue(result['site_errors'])
    def test_agent_scoped_noindex_header(self):
        self.assertIn('Sitemap page has noindex', inspect_page(GOOD, URL, headers={'X-Robots-Tag': 'googlebot: noindex'})['errors'])

if __name__ == '__main__': unittest.main()
