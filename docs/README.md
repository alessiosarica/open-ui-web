# Kaamos UI for the web: wiki

`@kaamos/open-ui-web` is the web library of the Kaamos design system: Web Components in **light DOM**, styled with **Tailwind CSS v4**, with the Inter font served locally. It works in any web project (plain HTML, Angular, others).

The design system has three kinds of components:

| Kind                       | When                                      | How you use it                     | Examples                                                            |
| -------------------------- | ----------------------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| **Web component**          | the component has behaviour or state      | a tag: `<kaamos-button>`           | button, text-input, search-bar, select, menu, tabs, command-palette |
| **Static CSS class**       | the component is only style               | a class on an HTML element         | badge, keycap, app-icon-tile, pill-tab, card, nav                   |
| **Native element + class** | the browser already has the right control | a class on `<input>` or `<dialog>` | checkbox, slider, dialog, popover                                   |

## Pages

| Page                                  | What you will find                                                         |
| ------------------------------------- | -------------------------------------------------------------------------- |
| [Getting started](getting-started.md) | Develop the library: Vite+, demo page, tests, build                        |
| [Architecture](architecture.md)       | Light DOM, how a component is built, the CSS layers, the published package |
| [Design spec (DESIGN.md)](DESIGN.md)  | The visual spec: colours, typography, sizes, component specs               |
| [Decisions](decisions.md)             | The key choices and their trade-offs                                       |

## Installation

```bash
npm install @kaamos/open-ui-web
```

### Project without Tailwind

```js
import "@kaamos/open-ui-web"; // registers the web components
import "@kaamos/open-ui-web/kaamos.css"; // fonts, tokens, reset, components and static classes
```

`kaamos.css` also includes Tailwind's reset (preflight), which normalises margins, fonts and form controls across the whole page.

### Project with Tailwind v4

You reuse the tokens as classes (`bg-canvas`, `text-body-md`, `rounded-md`…) in your own code:

```css
@import "tailwindcss";
@import "@kaamos/open-ui-web/fonts.css";
@import "@kaamos/open-ui-web/theme.css";
@import "@kaamos/open-ui-web/utilities.css";

/* Tailwind must read the classes used inside the web components */
@source "../node_modules/@kaamos/open-ui-web/dist";
```

### Angular

The `kaamos-*` tags are standard browser elements. Add `CUSTOM_ELEMENTS_SCHEMA` to the Angular components that use them:

```ts
@Component({
  selector: "app-root",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<kaamos-button variant="primary">Download</kaamos-button>`,
})
export class AppComponent {}
```

For form fields see [Text input › Angular](components/text-input.md#angular).

## Components

- [Button](components/button.md)
- [Text input](components/text-input.md)
- [Search bar](components/search-bar.md)
- [Form controls: checkbox, select, slider](components/form-controls.md)
- [Overlays: dialog, popover, menu](components/overlays.md)
- [Tabs](components/tabs.md)
- [Command palette](components/command-palette.md)
- [Containers: card and main navigation](components/containers.md)
- [Static classes: badge, keycap, app-icon-tile, pill-tab](components/static.md)

## Tokens

Every token is in `src/styles/theme.css` and becomes both a Tailwind class and a CSS variable:

| DESIGN.md token      | Tailwind class             | CSS variable             |
| -------------------- | -------------------------- | ------------------------ |
| `colors.canvas`      | `bg-canvas`, `text-canvas` | `var(--color-canvas)`    |
| `typography.body-md` | `text-body-md`             | `var(--text-body-md)`    |
| `rounded.md`         | `rounded-md`               | `var(--radius-md)`       |
| `spacing.section`    | `py-section`               | `var(--spacing-section)` |

Spacing follows Tailwind's 4px grid: `p-2` = 8px, `p-3` = 12px, `p-4` = 16px.

## Font

Inter 4.1 (variable, weights 100–900) is included in the package: no requests to external servers. The `calt`, `kern`, `liga` and `ss03` features are on across the whole page. License: SIL OFL 1.1.

To load it earlier, add a preload in the `<head>` with the path where your bundler serves `dist/fonts/InterVariable.woff2`.

## Writing these pages

- One page per topic, in English, linked with relative links only.
- Every page starts with a breadcrumb back to this Home and ends with "See also".
- A pull request that changes a component also updates its page.
