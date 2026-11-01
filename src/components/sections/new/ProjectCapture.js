import Image from "next/image";
import styles from "./ProjectCapture.module.css";

export default function ProjectCapture({ project, large = false }) {
  return (
    <figure className={`${styles.capture} ${large ? styles.large : ""}`}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        <span>{project.slug === "rate-family" ? "toprates.ca" : "Insurimple · Development demo"}</span>
      </div>
      <a href={project.image} target="_blank" rel="noopener noreferrer" className={styles.imageLink} aria-label={`View the full ${project.name} screenshot (opens in a new tab)`}>
        <Image src={project.image} alt={project.alt} width={1440} height={1000} sizes={large ? "(max-width: 760px) 100vw, 1150px" : "(max-width: 900px) 100vw, 680px"} quality={85} className={styles.image} />
        <span className={styles.expand} aria-hidden="true">View full screenshot ↗</span>
      </a>
      <figcaption>{project.caption}</figcaption>
    </figure>
  );
}
