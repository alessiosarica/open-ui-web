[Home](../README.md) › [Components](../README.md#components) › Overlays

# Overlays: dialog, popover, menu

All three use native browser APIs, so opening, closing with Esc and focus management work without our code.

| Component | What it is                             | When to use it                                             |
| --------- | -------------------------------------- | ---------------------------------------------------------- |
| Dialog    | `<dialog class="kaamos-dialog">`       | An answer is needed before going on ("Delete the file?")   |
| Popover   | `<div popover class="kaamos-popover">` | Information or light content next to a button              |
| Menu      | `<kaamos-menu>`                        | A list of actions that opens from a button (dropdown menu) |

DESIGN.md uses no shadows: overlays stand out from the page with the `surface` background and the `hairline` border.

## Dialog

```html
<kaamos-button commandfor="confirm" command="show-modal">Delete</kaamos-button>

<dialog id="confirm" class="kaamos-dialog" aria-labelledby="confirm-title">
  <h2 id="confirm-title">Delete the file?</h2>
  <p>You can restore it from the trash for 30 days.</p>
  <form method="dialog">
    <kaamos-button variant="secondary" type="submit" value="cancel">Cancel</kaamos-button>
    <kaamos-button variant="primary" type="submit" value="delete">Delete</kaamos-button>
  </form>
</dialog>
```

- **Open**: `commandfor` + `command="show-modal"` on the button (Invoker Commands API, no JS). Or from JS: `document.getElementById("confirm").showModal()`.
- **Close**: a `<form method="dialog">` closes the dialog when submitted, and `dialog.returnValue` holds the `value` of the pressed button. Esc closes it too.
- **Read the choice**:

```js
const dialog = document.getElementById("confirm");
dialog.addEventListener("close", () => {
  if (dialog.returnValue === "delete") deleteFile();
});
```

- With `showModal()` the rest of the page becomes inert and focus stays inside the dialog. Always give it a title linked with `aria-labelledby`.
- **Only one primary button**: the dialog's main action.

## Popover

```html
<kaamos-button variant="tertiary" popovertarget="info">Info</kaamos-button>

<div id="info" popover class="kaamos-popover">Help text next to the button.</div>
```

- It opens and closes with the button, and closes when you click outside or press Esc.
- **Position**: with CSS anchor positioning the popover attaches below the button that opens it and flips by itself if there is no room. In browsers without support it appears in the middle of the window: it still works.
- From JS: `el.showPopover()`, `el.hidePopover()`, `el.togglePopover()`.

## Menu · `<kaamos-menu>`

```html
<kaamos-button variant="tertiary" popovertarget="actions">Actions</kaamos-button>

<kaamos-menu id="actions" popover aria-label="File actions">
  <button>Rename</button>
  <button>Duplicate <kbd class="kaamos-keycap">⌘ D</kbd></button>
  <button disabled>Move</button>
  <hr />
  <button>Delete</button>
</kaamos-menu>
```

```js
document.getElementById("actions").addEventListener("kaamos-select", (event) => {
  console.log("Chosen:", event.detail.item);
});
```

- **Items**: every `<button>` becomes an item (`role="menuitem"`), every `<hr>` a separator. A `kbd.kaamos-keycap` inside the item is aligned to the right.
- **Keyboard**: on open, focus goes to the first item. ↑ ↓ move (wrapping around and skipping disabled items), Home and End go to the start and the end, Enter chooses, Esc closes, Tab closes and moves on.
- **Event** `kaamos-select`: fires when you choose an item, with `detail.item` = the button. Then the menu closes by itself.
- Write the `popover` attribute in the HTML: that way, if JS doesn't load, the menu stays hidden instead of showing up in the middle of the page.

## See also

- [Button](button.md): the attributes that open overlays
- [Command palette](command-palette.md)
