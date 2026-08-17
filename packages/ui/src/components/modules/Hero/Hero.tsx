import styles from "./Hero.module.css";
import { Badge } from "../../shared/Badge/Badge";
import type { HeroProps } from "./Hero.types";

export type {
  HeroVariant,
  HeroAlign,
  HeroHeadingLevel,
  HeroSize,
  HeroBadge,
  HeroProps,
} from "./Hero.types";

export function Hero({
  title,
  description,
  badge,
  variant = "brand",
  align = "left",
  headingLevel = "h1",
  size = "default",
  className,
}: HeroProps) {
  const Heading = headingLevel;

  const sectionClassName = [styles.hero, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClassName}>
      <div className={`${styles.inner} ${styles[align]}`}>
        {badge ? (
          <Badge
            className={styles.badge}
            variant="translucent"
            size="medium"
            icon={badge.icon}
          >
            {badge.label}
          </Badge>
        ) : null}

        <Heading className={`${styles.title} ${styles[headingLevel]}`}>
          {title}
        </Heading>

        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
    </section>
  );
}
