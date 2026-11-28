# @kaamos/open-ui-web

Web Components library of the **Kaamos** design system (FOSS open tools). Light DOM, styled with Tailwind CSS v4, Inter font served locally.

## Documentation

The full guide lives in the wiki in [`docs/`](docs/README.md): installation, every component, architecture and decisions. The visual spec is [`docs/DESIGN.md`](docs/DESIGN.md).

| Component                              | Kind                   | Use                                                 |
| -------------------------------------- | ---------------------- | --------------------------------------------------- |
| Button                                 | web component          | `<kaamos-button variant="primary">`                 |
| Icon (Lucide)                          | web component          | `<kaamos-icon name="mail">`                         |
| Text input                             | web component          | `<kaamos-text-input name="email">`                  |
| Search bar                             | web component          | `<kaamos-search-bar name="q">`                      |
| Command palette                        | web component          | `<kaamos-command-palette shortcut="k">`             |
| Tabs                                   | web component          | `<kaamos-tabs>`                                     |
| Menu                                   | web component          | `<kaamos-menu popover>`                             |
| Dialog, popover                        | native element + class | `<dialog class="kaamos-dialog">`                    |
| Select                                 | web component          | `<kaamos-select><select>…</select></kaamos-select>` |
| Checkbox, slider                       | native element + class | `<input type="checkbox" class="kaamos-checkbox">`   |
| Card, main navigation                  | CSS classes            | `class="kaamos-card"`, `class="kaamos-nav"`         |
| Badge, keycap, app icon tile, pill tab | CSS classes            | `class="kaamos-badge-pro"`                          |

## Development (Vite+)

```bash
npm install
npx vp dev            # demo page (index.html) with hot reload
npx vp test           # tests with Vitest + happy-dom
npx vp check          # formatting, lint, type check
npx vp run build:lib  # dist/: JS + .d.ts (vp pack), compiled CSS, fonts
```

More in [Getting started](docs/getting-started.md).

## Licenses

- Code: GPL-3.0 (see `LICENSE`).
- Inter font: SIL Open Font License 1.1 (see `src/fonts/OFL.txt`).
