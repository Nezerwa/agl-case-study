import type { Preview } from "@storybook/react-vite";

import "../../web/src/globals.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        mobile: {
          name: "Mobile",
          styles: { width: "390px", height: "844px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "834px", height: "1112px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
    a11y: {
      test: "todo",
    },
  },
  initialGlobals: {
    viewport: { value: "desktop" },
  },
};

export default preview;
