[Home](../README.md) › [Components](../README.md#components) › Static classes

# Static classes

Components with no behaviour: CSS classes to put on the right HTML element. No JavaScript, so no runtime cost. They also work with Tailwind variants (`hover:`, `md:`…) if your project uses Tailwind.

## Badge

```html
<span class="kaamos-badge-pro">Pro</span> <span class="kaamos-badge-info">Beta</span>
```

| Class               | Use                                                           |
| ------------------- | ------------------------------------------------------------- |
| `kaamos-badge-pro`  | Plan or tier: "Pro", "Pro+", "Free"                           |
| `kaamos-badge-info` | Rare label: "New", "Beta". Uses the blue accent: keep it rare |

## Keycap

Keyboard shortcuts. Always use the `<kbd>` element, which means "key" to screen readers.

```html
<kbd class="kaamos-keycap">⌘</kbd> <kbd class="kaamos-keycap">K</kbd>
<kbd class="kaamos-keycap">Esc</kbd>
```

## App icon tile

A tile for the icon of an app or integration. The image or SVG inside fills the whole tile.

```html
<span class="kaamos-app-icon-tile"><img src="mail.svg" alt="Kaamos Mail" /></span>
<span class="kaamos-app-icon-tile-lg"><img src="drive.svg" alt="Kaamos Drive" /></span>
```

| Class                     | Size  |
| ------------------------- | ----- |
| `kaamos-app-icon-tile`    | 48×48 |
| `kaamos-app-icon-tile-lg` | 64×64 |

If the icon is only decorative (the app name is already written next to it), use `alt=""`.

## Pill tab

A filter chip, used on `<button>`. The active state is **not** a class but an ARIA attribute: that way the style always follows what a screen reader hears.

```html
<div role="group" aria-label="Filter extensions">
  <button class="kaamos-pill-tab" aria-pressed="true">All</button>
  <button class="kaamos-pill-tab" aria-pressed="false">Recently Added</button>
  <button class="kaamos-pill-tab" aria-pressed="false">Most Popular</button>
</div>
```

- Filters that toggle on and off: `aria-pressed="true|false"`, updated by your code on click.
- Inside a tab group (`role="tablist"`): `aria-selected="true|false"`. See [Tabs](tabs.md).

## See also

- [Architecture](../architecture.md#static-components-as-utility): how `@utility` classes are built
- [Containers](containers.md)
