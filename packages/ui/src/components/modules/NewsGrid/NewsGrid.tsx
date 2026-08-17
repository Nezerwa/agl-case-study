import styles from "./NewsGrid.module.css";
import { NewsCard } from "../NewsCard/NewsCard";
import type { NewsGridProps } from "./NewsGrid.types";

export type { NewsGridItem, NewsGridProps } from "./NewsGrid.types";

const DEFAULT_ARIA_LABEL = "Actualités";
const DEFAULT_EMPTY_MESSAGE = "Aucune actualité dans cette catégorie.";

export function NewsGrid({
  items,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  ariaLabel = DEFAULT_ARIA_LABEL,
  headingLevel,
  linkComponent,
  className,
}: NewsGridProps) {
  const sectionClassName = [styles.section, className].filter(Boolean).join(" ");

  return (
    <section className={sectionClassName} aria-label={ariaLabel}>
      {items.length === 0 ? (
        <p className={styles.empty} role="status">
          {emptyMessage}
        </p>
      ) : (
        <ul className={styles.grid}>
          {items.map(({ id, ...card }) => (
            <li key={id} className={styles.item}>
              <NewsCard
                {...card}
                headingLevel={card.headingLevel ?? headingLevel}
                linkComponent={card.linkComponent ?? linkComponent}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
