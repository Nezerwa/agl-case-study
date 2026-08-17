import styles from "./CategoryFilter.module.css";
import { Button } from "../../shared/Button/Button";
import type { CategoryFilterProps } from "./CategoryFilter.types";

export type { CategoryOption, CategoryFilterProps } from "./CategoryFilter.types";

const DEFAULT_ARIA_LABEL = "Filtrer les actualités par catégorie";

export function CategoryFilter({
  categories,
  selectedValue,
  onChange,
  ariaLabel = DEFAULT_ARIA_LABEL,
  className,
}: CategoryFilterProps) {
  if (categories.length === 0) {
    return null;
  }

  const filterClassName = [styles.filter, className].filter(Boolean).join(" ");

  return (
    <div className={filterClassName}>
      <div className={styles.group} role="group" aria-label={ariaLabel}>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="filter"
            size="medium"
            isSelected={category.value === selectedValue}
            onClick={() => onChange(category.value)}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
