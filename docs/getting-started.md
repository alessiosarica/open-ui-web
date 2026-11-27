[Home](README.md) › Getting started

# Getting started

This page is for working **on** the library. To use it in a project, see [Home › Installation](README.md#installation).

## Requirements

- Node.js (a current LTS).
- The toolchain is [Vite+](https://viteplus.dev) (`vite-plus`): one CLI, `vp`, for dev server, tests, lint, formatting, type check and library build.

## Commands

```bash
npm install
npx vp dev            # demo page (index.html) with hot reload
npx vp test           # tests with Vitest + happy-dom
npx vp check          # formatting, lint, type check
npx vp run build:lib  # dist/: JS + .d.ts (vp pack), compiled CSS, fonts
```

The same are available as `npm run dev`, `npm test`, `npm run check`, `npm run build`.

## Repo layout

```
index.html            demo page with every component
demo/demo.css         demo page styles (Tailwind entry for the demo)
src/
  index.ts            registers every custom element
  components/<name>/  <name>.ts + <name>.test.ts, one folder per web component
  styles/
    theme.css         tokens as a Tailwind v4 @theme
    fonts.css         @font-face for Inter
    utilities.css     static components as @utility classes
    kaamos.css        entry of the compiled CSS for projects without Tailwind
  fonts/              Inter .woff2 + OFL license
scripts/copy-assets.mjs  copies fonts and source CSS to dist/
vite.config.ts        dev, pack, test and build tasks
docs/                 this wiki
```

## The build

`vp run build:lib` runs three tasks in order (`vp pack` cleans `dist/`, so it goes first):

1. `vp pack` (tsdown under the hood): `src/index.ts` → `dist/index.mjs` + `.d.mts`, ESM, minified, with source maps.
2. `build:css`: `tailwindcss -i src/styles/kaamos.css -o dist/styles/kaamos.css --minify`.
3. `build:assets`: `scripts/copy-assets.mjs` copies fonts, `theme.css`, `fonts.css` and `utilities.css` (a Node script rather than `cp`, so it works on Windows too).

## Tests

Each component has a `*.test.ts` next to it, run by Vitest in a fake DOM (happy-dom). They check attributes, forwarding to the inner native element, keyboard behaviour and events.

## Adding a component

1. Decide its kind (web component, static class or native element + class): see [Decisions](decisions.md#three-kinds-of-components).
2. Web component: `src/components/<name>/<name>.ts` + test, register it in `src/index.ts` with `define()`.
3. Static class: an `@utility` in `src/styles/utilities.css`, and add it to the `@source inline(...)` list in `kaamos.css`.
4. Show it on `index.html`, and write its page in `docs/components/`, linked from the [Home](README.md#components).

## See also

- [Architecture](architecture.md)
- [Decisions](decisions.md)
