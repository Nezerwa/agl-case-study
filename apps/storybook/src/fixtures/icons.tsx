export const TagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M2.5 5.833A3.333 3.333 0 0 1 5.833 2.5h8.334a3.333 3.333 0 0 1 3.333 3.333v8.334a3.333 3.333 0 0 1-3.333 3.333H5.833A3.333 3.333 0 0 1 2.5 14.167V5.833Zm3.333 1.667h8.334M5.833 10.833h5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M17.5 2.5 9.167 10.833M17.5 2.5l-5.833 15-3.334-6.667L1.667 7.5 17.5 2.5Z"
      stroke="currentColor"
      strokeWidth="1.667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.333 8h9.334M8.667 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * A ReactNode cannot be typed into the Controls panel, so icon props are exposed
 * as a dropdown of these keys and resolved to nodes through Storybook's `mapping`.
 * Every icon prop in this Storybook uses the same key set, so switching component
 * does not mean learning a new vocabulary.
 */
export const ICON_OPTIONS = ["none", "tag", "send", "arrow"];

export const ICON_MAPPING: Record<string, JSX.Element | undefined> = {
  none: undefined,
  tag: <TagIcon />,
  send: <SendIcon />,
  arrow: <ArrowRightIcon />,
};
