[Home](../README.md) › [Components](../README.md#components) › Command palette

# Command palette · `<kaamos-command-palette>`

The command palette: it opens with ⌘K (Ctrl+K on Linux and Windows), you type to filter, move with the arrows and pick with Enter. It is the signature component of DESIGN.md.

```html
<kaamos-command-palette shortcut="k" placeholder="Search for a command...">
  <button value="new-email">New email <kbd class="kaamos-keycap">⌘ N</kbd></button>
  <button value="search">Search mail</button>
  <button value="settings">Settings</button>
</kaamos-command-palette>
```

```js
const palette = document.querySelector("kaamos-command-palette");
palette.addEventListener("kaamos-select", (event) => {
  run(event.detail.item.value); // the chosen <button>
});
```

## Attributes

| Attribute     | Notes                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------- |
| `shortcut`    | Letter to press with ⌘/Ctrl to open and close. Without it, the palette opens only from JS |
| `placeholder` | Text in the search field. Default "Cerca un comando..."                                   |
| `aria-label`  | Name of the field for screen readers. Default "Comandi"                                   |

## Rows

Every child `<button>` is a row. Its `value` tells you which command was chosen. A `kbd.kaamos-keycap` inside the row is aligned to the right, an icon (`svg` or `kaamos-app-icon-tile`) to the left.

The filter searches the row's text, case-insensitively.

## Properties, methods and events

| Name                | Notes                                                                  |
| ------------------- | ---------------------------------------------------------------------- |
| `show()`, `close()` | Open and close the palette                                             |
| `open`              | `true` if it is open                                                   |
| `rows`              | Every row                                                              |
| `kaamos-select`     | Event: a row was chosen (`event.detail.item`). Then the palette closes |

## Accessibility

It uses the ARIA "combobox + listbox" pattern: focus always stays in the search field, so you can keep typing, and `aria-activedescendant` tells the screen reader which row is active. The container is a modal `<dialog>`: the rest of the page is inert while the palette is open.

## See also

- [Overlays](overlays.md): the menu uses the same `kaamos-select` event
- [Static classes](static.md#keycap): keycaps for shortcuts
