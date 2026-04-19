import { defineConfig } from "vite";

export default defineConfig({
  // Base préfixée pour GitHub Pages (project site : servi sous
  // /pokemon-roulette-helper/). En local, `vite dev` utilise aussi ce préfixe.
  base: "/pokemon-roulette-helper/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
});
