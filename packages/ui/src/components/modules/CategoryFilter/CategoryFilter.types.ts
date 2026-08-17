/**
 * `label` is what the reader sees and is translated; `value` is the stable key the
 * application filters on. They are kept apart so filtering never depends on display
 * text. `id` is the content item's own identity, which survives a label rename.
 */
export interface CategoryOption {
  id: string;
  label: string;
  value: string;
}

export interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}
