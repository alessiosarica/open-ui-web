# Documentazione di @kaamos/open-ui-web

Il design system Kaamos è fatto di due tipi di componenti:

| Tipo                         | Quando                                 | Come si usa                          | Esempi                                                              |
| ---------------------------- | -------------------------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| **Web component**            | il componente ha comportamento o stato | un tag: `<kaamos-button>`            | button, text-input, search-bar, select, menu, tabs, command-palette |
| **Classe CSS statica**       | il componente è solo stile             | una classe su un elemento HTML       | badge, keycap, app-icon-tile, pill-tab                              |
| **Elemento nativo + classe** | il browser ha già il controllo giusto  | una classe su `<input>` o `<dialog>` | checkbox, slider, dialog, popover                                   |

Le specifiche visive (colori, tipografia, misure) sono in [`DESIGN.md`](DESIGN.md).

## Installazione

```bash
npm install @kaamos/open-ui-web
```

### Progetto senza Tailwind

```js
import "@kaamos/open-ui-web"; // registra i web components
import "@kaamos/open-ui-web/kaamos.css"; // font, token, reset, componenti e classi statiche
```

`kaamos.css` include anche il reset di Tailwind (preflight), che normalizza margini, font e controlli dei form su tutta la pagina.

### Progetto con Tailwind v4

Riusi i token come classi (`bg-canvas`, `text-body-md`, `rounded-md`...) nel tuo codice:

```css
@import "tailwindcss";
@import "@kaamos/open-ui-web/fonts.css";
@import "@kaamos/open-ui-web/theme.css";
@import "@kaamos/open-ui-web/utilities.css";

/* Tailwind deve leggere le classi usate dentro i web components */
@source "../node_modules/@kaamos/open-ui-web/dist";
```

### Angular

I tag `kaamos-*` sono elementi standard del browser. Aggiungi `CUSTOM_ELEMENTS_SCHEMA` ai componenti Angular che li usano:

```ts
@Component({
  selector: "app-root",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<kaamos-button variant="primary">Download</kaamos-button>`,
})
export class AppComponent {}
```

## Componenti

- [Button](components/button.md)
- [Text input](components/text-input.md)
- [Search bar](components/search-bar.md)
- [Controlli dei form: checkbox, select, slider](components/form-controls.md)
- [Overlay: dialog, popover, menu](components/overlays.md)
- [Tab](components/tabs.md)
- [Command palette](components/command-palette.md)
- [Contenitori: card e navigazione principale](components/containers.md)
- [Classi statiche: badge, keycap, app-icon-tile, pill-tab](components/static.md)

## Token

Tutti i token sono in `src/styles/theme.css` e diventano sia classi Tailwind sia variabili CSS:

| Token DESIGN.md      | Classe Tailwind            | Variabile CSS            |
| -------------------- | -------------------------- | ------------------------ |
| `colors.canvas`      | `bg-canvas`, `text-canvas` | `var(--color-canvas)`    |
| `typography.body-md` | `text-body-md`             | `var(--text-body-md)`    |
| `rounded.md`         | `rounded-md`               | `var(--radius-md)`       |
| `spacing.section`    | `py-section`               | `var(--spacing-section)` |

Le spaziature seguono la griglia da 4px di Tailwind: `p-2` = 8px, `p-3` = 12px, `p-4` = 16px.

## Font

Inter 4.1 (variabile, pesi 100-900) è incluso nel pacchetto, nessuna richiesta a server esterni. Le feature `calt`, `kern`, `liga` e `ss03` sono attive su tutta la pagina. Licenza: SIL OFL 1.1.

Per caricarlo prima, aggiungi un preload nell'`<head>` con il percorso dove il tuo bundler serve `dist/fonts/InterVariable.woff2`.
