[Home](../README.md) › [Components](../README.md#components) › Text input

# Text input · `<kaamos-text-input>`

A single-line text field. Inside it creates a native `<input>`, which takes part in the `<form>` and in browser validation.

```html
<label>
  Email
  <kaamos-text-input
    name="email"
    type="email"
    placeholder="you@example.org"
    required
  ></kaamos-text-input>
</label>
```

You can wrap it in a `<label>`: thanks to the light DOM the inner input is a real descendant of the label, so clicking the text focuses the input.

## Attributes

| Attribute                                          | Notes                                                          |
| -------------------------------------------------- | -------------------------------------------------------------- |
| `type`                                             | `text` (default), `email`, `password`, `url`, `tel`, `number`… |
| `name`, `placeholder`, `autocomplete`, `inputmode` | forwarded to the input                                         |
| `minlength`, `maxlength`, `pattern`                | native validation                                              |
| `value`                                            | **initial** value (like the native input's attribute)          |
| `required`, `disabled`, `readonly`                 | booleans                                                       |
| `aria-label`, `aria-describedby`                   | for accessibility when there is no visible label               |

## Properties and events

```js
const el = document.querySelector("kaamos-text-input");
el.value; // current value
el.value = "hello";
el.focus();
el.addEventListener("input", (e) => console.log(e.target.value)); // native events bubble up to the tag
```

## Style

Height 36px, `surface-elevated` background, `hairline` border. On focus the border becomes `hairline-strong`: a slight brightening, not a coloured ring.

## Angular

Add `ngDefaultControl` to the tag: Angular will use its standard adapter for text fields.

```html
<kaamos-text-input name="email" ngDefaultControl [(ngModel)]="email"></kaamos-text-input>
<kaamos-text-input formControlName="name" ngDefaultControl></kaamos-text-input>
```

Why it all works:

| What Angular does                           | How the component handles it                                                |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| Writes the value: `tag.value = ...`         | `value` setter                                                              |
| Listens to `input` on the tag               | the inner field's event bubbles up to the tag (light DOM)                   |
| Listens to `blur` on the tag for "touched"  | `blur` doesn't bubble, so the component re-dispatches it on the tag         |
| `form.disable()` does `tag.disabled = true` | `disabled` property (and `required`, `readOnly`) reflected to the attribute |

The same applies to [`kaamos-search-bar`](search-bar.md).

## See also

- [Search bar](search-bar.md)
- [Form controls](form-controls.md)
