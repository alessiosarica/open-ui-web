# @kaamos/webcomponents

Libreria di Web Components del design system **Kaamos** (open tools FOSS).
Light DOM, stile con Tailwind CSS v4, font Inter servito in locale. Le specifiche
di design sono in [`docs/DESIGN.md`](docs/DESIGN.md).

## Documentazione

Guida completa all'uso, componente per componente: [`docs/README.md`](docs/README.md).

| Componente                             | Tipo                     | Uso                                                 |
| -------------------------------------- | ------------------------ | --------------------------------------------------- |
| Button                                 | web component            | `<kaamos-button variant="primary">`                 |
| Text input                             | web component            | `<kaamos-text-input name="email">`                  |
| Search bar                             | web component            | `<kaamos-search-bar name="q">`                      |
| Command palette                        | web component            | `<kaamos-command-palette shortcut="k">`             |
| Tab                                    | web component            | `<kaamos-tabs>`                                     |
| Menu                                   | web component            | `<kaamos-menu popover>`                             |
| Dialog, popover                        | elemento nativo + classe | `<dialog class="kaamos-dialog">`                    |
| Select                                 | web component            | `<kaamos-select><select>…</select></kaamos-select>` |
| Checkbox, slider                       | elemento nativo + classe | `<input type="checkbox" class="kaamos-checkbox">`   |
| Card, navigazione principale           | classi CSS               | `class="kaamos-card"`, `class="kaamos-nav"`         |
| Badge, keycap, app icon tile, pill tab | classi CSS               | `class="kaamos-badge-pro"`                          |

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
