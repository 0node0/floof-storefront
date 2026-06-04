// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  site: "https://floof.space",
  integrations: [react(), tailwind()],
  vite: {
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
});