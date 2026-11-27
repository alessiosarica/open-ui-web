[Home](../README.md) › [Components](../README.md#components) › Button

# Button · `<kaamos-button>`

Action button. Inside it creates a native `<button>`: keyboard, focus and forms work like a normal button.

```html
<kaamos-button variant="primary">Download</kaamos-button>
<kaamos-button variant="secondary">Learn more →</kaamos-button>
<kaamos-button variant="tertiary">Watch demo</kaamos-button>
<kaamos-button variant="install">Install</kaamos-button>
<kaamos-button variant="primary" disabled>Download</kaamos-button>
```

## Attributes

| Attribute                                                       | Values                                        | Default   | Notes                                                                         |
| --------------------------------------------------------------- | --------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| `variant`                                                       | `primary`, `secondary`, `tertiary`, `install` | `primary` | Unknown value → `primary`                                                     |
| `disabled`                                                      | boolean                                       | absent    | Same style for every variant                                                  |
| `type`                                                          | `button`, `submit`, `reset`                   | `button`  | Unlike the native `<button>` (which is `submit`): avoids accidental submits   |
| `name`, `value`, `form`                                         | as the native `<button>`                      |           | Forwarded to the inner button                                                 |
| `aria-label`, `aria-pressed`                                    |                                               |           | Forwarded to the inner button                                                 |
| `popovertarget`, `popovertargetaction`, `commandfor`, `command` |                                               |           | Forwarded, so the button opens popovers, menus and dialogs without JavaScript |

## JavaScript properties

```js
const el = document.querySelector("kaamos-button");
el.variant = "tertiary";
el.disabled = true;
el.focus(); // focuses the inner button
el.button; // the native <button>
```

## Guidelines (DESIGN.md)

- **Only one `primary` per screen**: white is reserved for the main action.
- `secondary` for light actions ("Learn more →"), `tertiary` for medium actions inside cards, `install` on store cards.
- Height 36px (install 32px), already above the WCAG AA threshold for touch targets.

## Inside a form

```html
<form>
  <kaamos-text-input name="email" type="email"></kaamos-text-input>
  <kaamos-button variant="primary" type="submit">Subscribe</kaamos-button>
</form>
```

## See also

- [Overlays](overlays.md): opening dialogs and popovers from a button
- [Static classes](static.md#pill-tab): pill tabs for filters
