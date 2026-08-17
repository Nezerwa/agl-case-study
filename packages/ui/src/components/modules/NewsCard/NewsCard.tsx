import styles from "./NewsCard.module.css";
import { Badge } from "../../shared/Badge/Badge";
import { ButtonLink } from "../../shared/ButtonLink/ButtonLink";
import type { NewsCardProps } from "./NewsCard.types";

export type {
  NewsCardImage,
  NewsCardHeadingLevel,
  NewsCardProps,
} from "./NewsCard.types";

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.333 1.333v2M10.667 1.333v2M2 6.06h12M14 5.667V11.333c0 2-1 3.333-3.333 3.333H5.333C3 14.666 2 13.333 2 11.333V5.667c0-2 1-3.334 3.333-3.334h5.334C13 2.333 14 3.667 14 5.667Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3.333 8h9.334M8.667 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function NewsCard({
  image,
  categoryLabel,
  date,
  title,
  description,
  href,
  readMoreLabel = "Lire la suite",
  headingLevel = "h3",
  linkComponent,
  className,
}: NewsCardProps) {
  const Heading = headingLevel;
  const cardClassName = [styles.card, className].filter(Boolean).join(" ");

  return (
    <article className={cardClassName}>
      <div className={styles.media}>
        <img className={styles.image} src={image.src} alt={image.alt} />
        <Badge className={styles.badge} variant="solid" size="small">
          {categoryLabel}
        </Badge>
      </div>

      <div className={styles.content}>
        <p className={styles.date}>
          <span className={styles.dateIcon} aria-hidden="true">
            <CalendarIcon />
          </span>
          {date}
        </p>

        <Heading className={styles.title}>{title}</Heading>

        <p className={styles.description}>{description}</p>

        <div className={styles.cta}>
          <ButtonLink
            href={href}
            variant="link"
            icon={<ArrowRightIcon />}
            iconPosition="right"
            linkComponent={linkComponent}
          >
            <span aria-hidden="true">{readMoreLabel}</span>
            <span className={styles.srOnly}>{`${readMoreLabel} — ${title}`}</span>
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
