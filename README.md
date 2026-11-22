# @kaamos/webcomponents

Libreria di Web Components del design system **Kaamos** (open tools FOSS).
Light DOM, stile con Tailwind CSS v4, font Inter servito in locale. Le specifiche
di design sono in [`docs/DESIGN.md`](docs/DESIGN.md).

## Componenti

| Tag                 | Varianti / attributi                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| `kaamos-button`     | `variant="primary \| secondary \| tertiary \| install"`, `disabled`, `type` |
| `kaamos-text-input` | `name`, `type`, `placeholder`, `value`, `required`, `disabled`, ...         |
| `kaamos-search-bar` | da implementare                                                             |

## Uso

Senza Tailwind nel tuo progetto:

```js
import "@kaamos/webcomponents";
import "@kaamos/webcomponents/kaamos.css";
```

Con Tailwind v4 nel tuo progetto (riusi i token e le classi):

```css
@import "tailwindcss";
@import "@kaamos/webcomponents/fonts.css";
@import "@kaamos/webcomponents/theme.css";
/* Tailwind deve vedere le classi usate dentro i componenti */
@source "../node_modules/@kaamos/webcomponents/dist";
```

In Angular aggiungi `CUSTOM_ELEMENTS_SCHEMA` ai componenti che usano i tag `kaamos-*`.

## Sviluppo (Vite+)

```bash
npm install
npx vp dev          # pagina demo (index.html) con hot reload
npx vp test         # test con Vitest + happy-dom
npx vp check        # formattazione, lint, type check
npx vp run build:lib  # dist/: JS + .d.ts (vp pack), CSS compilato, font
```

## Licenze

- Codice: GPL-3.0 (vedi `LICENSE`).
- Font Inter: SIL Open Font License 1.1 (vedi `src/fonts/OFL.txt`).
