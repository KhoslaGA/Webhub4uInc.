import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import FaqBlock from "@/components/sections/new/FaqBlock";
import CtaNew from "@/components/sections/new/CtaNew";
import JsonLd from "@/components/seo/JsonLd";
import { getCity, CITY_SLUGS, siblingCities } from "@/data/locations";
import { SERVICES } from "@/data/services";
import { localBusinessLd, faqLd, breadcrumbLd } from "@/lib/schema";
import styles from "@/components/sections/new/LocationPage.module.css";

export function generateStaticParams() {
  return CITY_SLUGS.map((city) => ({ city }));
}

export function generateMetadata({ params }) {
  const city = getCity(params.city);
  if (!city) return {};
  return {
    title: `AI Receptionist & Web Design in ${city.name} | Webhub4U`,
    description: city.metaDescription,
    alternates: { canonical: `/locations/${city.slug}` },
    openGraph: {
      title: `Web Design & AI for ${city.name} Businesses — Webhub4U`,
      description: city.metaDescription,
      url: `https://www.webhub4u.com/locations/${city.slug}`,
      type: "website",
    },
  };
}

export default function CityPage({ params }) {
  const city = getCity(params.city);
  if (!city) notFound();

  const siblings = siblingCities(city.slug);
  const ld = [
    localBusinessLd({ areaServed: `${city.name}, Ontario` }),
    faqLd(city.faqs),
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Locations", path: "/locations" },
      { name: city.name, path: `/locations/${city.slug}` },
    ]),
  ];

  return (
    <PageShell>
      {ld.map((d, i) => (
        <JsonLd key={i} data={d} />
      ))}

      <PageHero
        eyebrow={`Serving ${city.name}`}
        title={
          <>
            Web design &amp; AI tools for{" "}
            <span className="wh-em">{city.name} businesses.</span>
          </>
        }
        sub={`Modern websites, local SEO, and AI receptionists for businesses across ${city.name} — built to get you found and stop you losing leads.`}
      />

      {/* breadcrumb + intro */}
      <section className={`wh ${styles.intro}`}>
        <div className="wh-inner">
          <nav className={styles.crumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/locations">Locations</Link>
            <span>/</span>
            <span aria-current="page">{city.name}</span>
          </nav>
          <div className={styles.prose}>
            {city.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className={styles.hoods}>
            <p className={styles.hoodsLabel}>Neighbourhoods we serve</p>
            <div className={styles.chips}>
              {city.neighbourhoods.map((n) => (
                <span key={n} className={styles.chip}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* services */}
      <section className={`wh ${styles.services}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">What we do in {city.name}</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Everything you need to <span className="wh-em">win locally.</span>
          </h2>
          <div className={styles.grid}>
            {SERVICES.map((s) => (
              <Link key={s.slug} href={s.href} className={styles.card}>
                <span
                  className={`${styles.tag} ${s.tag === "AI" ? styles.tagAi : ""}`}
                >
                  {s.tag}
                </span>
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                <span className={styles.from}>from {s.priceFrom}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* city FAQ */}
      <section className={`wh ${styles.faq}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">{city.name} questions</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Asked by <span className="wh-em">{city.name} businesses.</span>
          </h2>
          <FaqBlock items={city.faqs} />
        </div>
      </section>

      {/* siblings + link back to hub */}
      <section className={`wh ${styles.near}`}>
        <div className={`wh-inner ${styles.nearInner}`}>
          <p className={styles.nearLabel}>Also serving nearby</p>
          <div className={styles.nearLinks}>
            {siblings.map((s) => (
              <Link key={s.slug} href={`/locations/${s.slug}`}>
                {s.name}
              </Link>
            ))}
            <Link href="/locations" className={styles.allLink}>
              All areas we serve →
            </Link>
          </div>
        </div>
      </section>

      <CtaNew />
    </PageShell>
  );
}
