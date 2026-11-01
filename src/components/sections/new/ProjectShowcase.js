import Image from "next/image";
import Link from "next/link";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";
import styles from "./ProjectShowcase.module.css";

export default function ProjectShowcase() {
  return (
    <div>
      <div className={styles.projects}>
        {PORTFOLIO_ITEMS.map(project => (
          <article key={project.slug} className={styles.project} aria-labelledby={`project-${project.slug}`}>
            <Link href={`/projects/${project.caseStudy}`} className={styles.preview} aria-label={`Explore ${project.name} in the ${project.caseStudy === "rate-family" ? "RateFamily" : "Insurimple"} case study`}>
              <Image src={project.image} alt={project.alt} width={project.width} height={project.height} sizes="(max-width: 580px) 100vw, (max-width: 1000px) 50vw, 380px" quality={85} className={styles.image} />
              <span className={styles.previewArrow} aria-hidden="true">↗</span>
            </Link>
            <div className={styles.content}>
              <p className={styles.status}>{project.status}</p>
              <h3 id={`project-${project.slug}`}>{project.name}</h3>
              <p className={styles.category}>{project.category}</p>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.links}>
                <Link href={`/projects/${project.caseStudy}`} aria-label={`${project.name} case study`}>Case study <span aria-hidden="true">↗</span></Link>
                {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} (opens in a new tab)`}>Visit site <span aria-hidden="true">↗</span></a>}
              </div>
            </div>
          </article>
        ))}
        <div className={styles.invitation}>
          <p className={styles.eyebrow}>Your next project</p>
          <p className={styles.invitationTitle}>Let&apos;s build something<br /><em>worth showing.</em></p>
          <p>From a focused website to a connected software platform.</p>
          <Link href="/contact#project-enquiry">Start your project <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <p className={styles.note}>Owned and built by Webhub4U. Actual interface captures from November 2026; shown to illustrate our design work. RateFamily&apos;s public sites and V2 development have separate release paths. Insurimple shows synthetic demo data.</p>
    </div>
  );
}
