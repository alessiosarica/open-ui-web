import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";

export default defineConfig({
  // vp dev: serve index.html (pagina demo) con Tailwind e hot reload.
  plugins: [tailwindcss()],

  // vp pack: costruisce la libreria per npm (tsdown sotto il cofano).
  pack: {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    minify: true,
  },

  // vp test: Vitest con un DOM finto (happy-dom) per provare i componenti.
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
  },

  // vp run <task>: task con cache automatica di Vite Task.
  run: {
    tasks: {
      // CSS compilato e minificato per chi NON usa Tailwind.
      "build:css": {
        command: "tailwindcss -i src/styles/kaamos.css -o dist/styles/kaamos.css --minify",
      },
      // Font e file sorgenti per chi usa Tailwind nel proprio progetto.
      "build:assets": {
        command: "node scripts/copy-assets.mjs",
      },
      // vp pack pulisce dist/, quindi va eseguito per primo.
      "build:lib": {
        command: ["vp pack", "vp run build:css", "vp run build:assets"],
      },
    },
  },

  lint: {
    ignorePatterns: ["dist/**"],
  },
});
