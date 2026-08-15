import styles from "./UnknownComponent.module.css";
import type { UnknownComponentProps } from "./UnknownComponent.types";

export function UnknownComponent({ componentName }: UnknownComponentProps) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className={styles.unknown} role="note">
      No component registered for{" "}
      <span className={styles.name}>{componentName}</span>
    </div>
  );
}
