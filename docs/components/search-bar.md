[Home](../README.md) › [Components](../README.md#components) › Search bar

# Search bar · `<kaamos-search-bar>`

A search field with the magnifying glass on the left, taller than the text input (44px). It uses `<input type="search">`: Esc clears the field and on mobile the keyboard shows the "Search" key.

```html
<form action="/store">
  <kaamos-search-bar
    name="q"
    placeholder="Search..."
    aria-label="Search extensions"
  ></kaamos-search-bar>
</form>
```

Pressing Enter submits the form, with no extra code.

## Accessibility

The placeholder is **not** a label: it disappears when you type and many screen readers don't read it. Always set an `aria-label`.

Don't put the search bar inside a `<label>`: the component already uses a label as its container (so clicking the magnifying glass focuses the input), and nested labels are not valid.

## Attributes

`name`, `placeholder`, `value`, `autocomplete`, `minlength`, `maxlength`, `aria-label`, `aria-describedby`, `required`, `disabled`, `readonly`.

## Properties and events

Like the [text input](text-input.md): `value`, `disabled`, `required`, `readOnly`, `focus()`, `input` (the native field), `input`/`change`/`blur` events. With Angular use `ngDefaultControl` (see [text input](text-input.md#angular)).

## See also

- [Text input](text-input.md)
- [Command palette](command-palette.md)
