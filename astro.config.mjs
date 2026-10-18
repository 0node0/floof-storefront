// @ts-check
import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

const ogBuildId = (
  process.env.RAILWAY_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.PUBLIC_OG_BUILD_ID ||
  ""
)
  .replace(/[^a-zA-Z0-9]/g, "")
  .slice(0, 12);

// Node adapter for Railway (reliable SSR). Cloudflare Pages remains a later option
// once @astrojs/cloudflare + Astro 6 build is stable in this environment.
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  site: "https://floof.space",
  env: {
    schema: {
      PUBLIC_OG_BUILD_ID: envField.string({
        context: "server",
        access: "public",
        default: ogBuildId || undefined,
      }),
    },
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
});
