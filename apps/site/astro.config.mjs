import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://leftjun.com",
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes("/404/")) return false;
        return !/(?:^|\/)projects\/(?:action-game-ip-design|ai-game-creation-research|ai-game-project-management)\/?$/.test(new URL(page).pathname);
      }
    })
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
