[Home](../README.md) › [Components](../README.md#components) › Tabs

# Tabs · `<kaamos-tabs>`

Splits content into sections, showing one at a time. There is no native HTML element for tabs, so the component implements the ARIA "tabs" pattern (tablist, tab, tabpanel). The tabs use the [`kaamos-pill-tab`](static.md#pill-tab) style.

```html
<kaamos-tabs>
  <div aria-label="Account settings">
    <button>General</button>
    <button>Account</button>
    <button>Privacy</button>
  </div>
  <section>Language, theme and shortcuts.</section>
  <section>Name, email and password.</section>
  <section>Privacy settings.</section>
</kaamos-tabs>
```

## Structure

- **First child**: the tab list. Every `<button>` inside is a tab. Give it an `aria-label` that describes the group.
- **Following children**: the panels, in the same order as the tabs.

The component links tabs and panels by itself (`aria-controls`, `aria-labelledby`), generating ids if they are missing.

## Attributes, properties and events

| Name             | Type                   | Notes                                           |
| ---------------- | ---------------------- | ----------------------------------------------- |
| `selected`       | attribute / property   | Index of the active tab, from 0. Default `0`    |
| `tabs`, `panels` | properties (read-only) | The buttons and the panels                      |
| `kaamos-change`  | event                  | When the user changes tab. `event.detail.index` |

```js
const tabs = document.querySelector("kaamos-tabs");
tabs.selected = 2;
tabs.addEventListener("kaamos-change", (e) => console.log(e.detail.index));
```

## Keyboard

- **Tab**: enters the active tab; the next Tab goes into the panel.
- **← →**: previous and next tab, wrapping around. The tab activates immediately (automatic activation).
- **Home / End**: first and last tab.

## Tabs or standalone pill tabs?

Use `<kaamos-tabs>` when each tab shows a **different panel**. If the buttons instead **filter the same list** ("All", "Most Popular"), use [pill tabs](static.md#pill-tab) with `aria-pressed`: for a screen reader they are two different things.

## See also

- [Static classes](static.md#pill-tab)
