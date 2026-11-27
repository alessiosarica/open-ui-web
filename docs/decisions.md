[Home](README.md) › Decisions

# Decisions

Lightweight ADRs: when a decision changes, update its entry and say why.

## Web Components, not a framework library

**Decision**: standard Custom Elements written in TypeScript, no Angular/React/Lit.
**Why**: they work in every framework (Angular, plain HTML, others) and need no runtime.
**Trade-off**: some integration glue per framework, such as `CUSTOM_ELEMENTS_SCHEMA` and `ngDefaultControl` in Angular.

## Light DOM instead of Shadow DOM

**Decision**: no Shadow DOM.
**Why**: global Tailwind classes, native form participation, `<label>` wrapping, `popovertarget`/`commandfor` across the page, and bubbling events for Angular all work without workarounds.
**Trade-off**: no style encapsulation: page CSS can affect component internals. See [Architecture](architecture.md#light-dom-no-shadow-dom).

## Three kinds of components

**Decision**: web component only when there is behaviour or state; static `@utility` class when it's only style; native element + class when the browser already has the control.
**Why**: the least JavaScript possible, and the browser's accessibility and form behaviour for free.

## Native elements first

**Decision**: checkbox, slider, dialog and popover are native elements; `kaamos-select` wraps a native `<select>` that holds the value.
**Why**: keyboard, validation, `FormData`, reset and screen readers come from the browser; things still work if JavaScript fails to load.

## Identical look in every browser

**Decision**: no system UI that varies by browser or OS. That's why the select draws its own list.
**Why**: Kaamos must look the same everywhere.
**Trade-off**: on mobile the native picker (for example the iOS wheel) doesn't appear.

## Tailwind CSS v4 for styling

**Decision**: Tailwind v4 with tokens in `@theme`, and a compiled `kaamos.css` for projects without Tailwind.
**Why**: tokens become both classes and CSS variables from one file; unused classes are not shipped.
**Trade-off**: class names must be written in full in the source, never concatenated.

## Inter served locally

**Decision**: Inter 4.1 is bundled in the package.
**Why**: privacy (no requests to Google Fonts or other servers) and works offline.

## Vite+ toolchain

**Decision**: `vite-plus` (`vp`) for dev, test, lint, format, type check and pack.
**Why**: one tool and one config instead of several.

## License: GPL-3.0

Code under GPL-3.0-only; Inter under SIL OFL 1.1.

## See also

- [Architecture](architecture.md)
- [Home](README.md)
