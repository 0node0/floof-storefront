// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Node adapter for Railway (reliable SSR). Cloudflare Pages remains a later option
// once @astrojs/cloudflare + Astro 6 build is stable in this environment.
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  site: "https://floof.space",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
});
