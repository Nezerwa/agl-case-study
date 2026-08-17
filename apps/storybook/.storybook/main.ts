import react from "@vitejs/plugin-react";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  /**
   * `SiteLogo.src` is an opaque URL string that `@agl/ui` passes straight to `<img>`,
   * so the asset has to exist at the same root-relative path Next serves it from.
   * Pointing Storybook at the app's public directory — rather than copying the file —
   * keeps one source of truth for /logo.jpg and /icons/*.
   */
  staticDirs: ["../../web/public"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), react()],
    server: {
      ...viteConfig.server,
      fs: {
        ...viteConfig.server?.fs,
        allow: ["../.."],
      },
    },
  }),
};

export default config;
