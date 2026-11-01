import Link from "next/link";
import { PORTFOLIO } from "@/data/portfolio";
import ProjectCapture from "./ProjectCapture";
import styles from "./ProjectShowcase.module.css";

export default function ProjectShowcase() {
  return (
    <div className={styles.projects}>
      {PORTFOLIO.map((project, index) => (
        <article key={project.slug} className={`${styles.project} ${index === 1 ? styles.dark : ""}`} aria-labelledby={`project-${project.slug}`}>
          <div className={styles.masthead}>
            <p className={styles.category}><span aria-hidden="true">0{index + 1}</span>{project.category}</p>
            <p className={styles.status}><span aria-hidden="true" />{project.status}</p>
          </div>
          <div className={styles.content}>
            <div className={styles.story}>
              <p className={styles.name}>{project.name}</p>
              <h3 id={`project-${project.slug}`}>{project.headline}</h3>
              <p className={styles.description}>{project.description}</p>
              <dl className={styles.scope}>
                {project.scope.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}
              </dl>
              <div className={styles.links}>
                <Link href={`/projects/${project.slug}`} className={styles.primary}>{project.linkLabel}<span aria-hidden="true">↗</span></Link>
                {project.live && <a href={project.live.href} target="_blank" rel="noopener noreferrer" className={styles.secondary}>{project.live.label} ↗</a>}
              </div>
            </div>
            <div className={styles.visual}>
              <p className={styles.visualLabel}>{project.imageLabel}</p>
              <ProjectCapture project={project} />
              <ul className={styles.highlights} aria-label={project.slug === "rate-family" ? "The four RateFamily brands" : "Insurimple focus areas"}>
                {project.highlights.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
          <p className={styles.note}>Built and owned by Webhub4U. {project.note}</p>
        </article>
      ))}
    </div>
  );
}
