import styles from "./Hero.module.css";
import type { HeroProps } from "./Hero.types";

export type { HeroProps } from "./Hero.types";

export function Hero({ eyebrow, title, description }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
    </section>
  );
}
