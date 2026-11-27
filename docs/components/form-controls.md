[Home](../README.md) › [Components](../README.md#components) › Form controls

# Form controls: checkbox, select, slider

Checkbox and slider are **native elements** (`<input>`) with a Kaamos class. The select is instead a web component that wraps a native `<select>` (see below). The browser keeps handling keyboard, forms, validation and screen readers. The class only changes the look, thanks to `appearance: none`.

One more advantage: in Angular they work directly with `ngModel` and reactive forms, with no adapters.

## Checkbox

```html
<label>
  <input type="checkbox" class="kaamos-checkbox" name="news" checked />
  Get the news
</label>
```

- Checked: white `primary` with a black tick, like the primary button.
- `disabled`: supported.
- The "partially checked" state (for example "select all" when only some items are selected) exists only from JavaScript.

```js
document.querySelector("#all").indeterminate = true;
```

Always put the checkbox inside a `<label>` (or link them with `for`/`id`): that way clicking the text works too.

## Select · `<kaamos-select>`

The select is the only form control that is a **web component**: the drop-down list of a native `<select>` can't be styled the same way in every browser, so `kaamos-select` draws its own. That way it looks identical everywhere.

Inside, you write a normal `<select>`:

```html
<label>
  Language
  <kaamos-select>
    <select name="language" required>
      <option value="" hidden>Choose a language</option>
      <optgroup label="Nordic countries">
        <option value="fi">Suomi</option>
        <option value="sv">Svenska</option>
        <option value="is" disabled>Íslenska</option>
      </optgroup>
      <option value="it">Italiano</option>
    </select>
  </kaamos-select>
</label>
```

**How it works**: the native `<select>` stays in the DOM but invisible, and it is the one holding the value. The component reads its `<option>`s, draws the field and the list, and when you pick an option it updates the select and fires `input` and `change` on it. That's why these work with no extra code:

- `FormData`, form submission, `required` (the browser's error bubble appears on the field) and form reset;
- Angular's `ngModel` and reactive forms, placed on the inner `<select>`;
- `select.value = "sv"` from JavaScript: the field updates;
- `<optgroup>`, `disabled` options, and a placeholder option with `value=""` and `hidden`;
- if JavaScript doesn't load, the user sees a working native select.

```js
const language = document.querySelector("kaamos-select select");
language.addEventListener("change", () => console.log(language.value));
```

**Keyboard** (ARIA "select-only combobox" pattern, focus always stays on the field):

| Key               | List closed               | List open                                                    |
| ----------------- | ------------------------- | ------------------------------------------------------------ |
| ↓ ↑ Enter Space   | opens                     | ↓ ↑ move (skipping disabled options), Enter and Space choose |
| Home / End        | opens on the first / last | first / last option                                          |
| PageUp / PageDown |                           | jumps by 10                                                  |
| Esc               |                           | closes without changing                                      |
| Tab               |                           | chooses the active option and moves on                       |
| Letters           | changes the value at once | moves the active option                                      |

**Type to search**: different letters search the start of the text ("sv" → Svenska); the same letter repeated cycles through the options starting with it ("s", "s" → Svenska, then Suomi). After half a second of pause the search starts over.

**Position**: the list opens below the field, above it if there is no room below, and at least as wide as the field. It uses CSS anchor positioning where available, and a JavaScript calculation in other browsers.

**Trade-off**: on mobile the system picker (for example the iOS "wheel") doesn't appear; our list does.

**Attributes** on the tag: `aria-label`, `aria-labelledby`, `aria-describedby` (forwarded to the field, if you don't use a `<label>`). Everything else (`name`, `required`, `disabled`…) goes on the inner `<select>`.

## Slider

```html
<label>
  Volume
  <input type="range" class="kaamos-range" name="volume" min="0" max="100" value="60" />
</label>
```

- A 4px `hairline-strong` track, a 16px white thumb.
- Supports `min`, `max`, `step` and `disabled` like the native range.
- **Known limit**: the "filled" part to the left of the thumb isn't coloured, because Chrome and Safari have no pseudo-element to do it with CSS alone (Firefox does). It would need a bit of JavaScript that updates a CSS variable on every move.

## See also

- [Text input](text-input.md)
- [Decisions](../decisions.md#native-elements-first)
