[Home](../README.md) › [Components](../README.md#components) › Icon

# Icon · `<kaamos-icon>`

A [Lucide](https://lucide.dev/icons) icon. The 2,140 icons come from `@kaamos-project/open-design-tokens/icons`, the same set the Flutter library uses (see the tokens wiki: [Icons](https://github.com/kaamos-project/open-design-tokens/blob/main/docs/icons.md)).

```js
import { registerIcons } from "@kaamos/open-ui-web";
import { mail, chevronDown } from "@kaamos-project/open-design-tokens/icons";

registerIcons({ mail, chevronDown });
```

```html
<kaamos-icon name="mail"></kaamos-icon>
<kaamos-icon name="chevronDown" class="size-5 text-mute"></kaamos-icon>
<kaamos-icon name="mail" label="Unread"></kaamos-icon>
```

## Why you register the icons

`<kaamos-icon name="mail">` could work with no setup only if the element imported all 2,140 icons to look the name up: about 570 KB of JavaScript in every app. With `registerIcons` the app imports just the icons it uses, and the bundler (Vite, the Angular CLI) drops the others: **tree-shaking**. Three icons weigh a few hundred bytes.

It's the same rule as in Flutter, where `KaamosIcons` must be `const`: the build tool has to _see_ which icons you use.

- The name is the key you register: `registerIcons({ chevronDown })` → `name="chevronDown"`. Lucide's `kebab-case` names become `camelCase` (`circle-alert` → `circleAlert`); reserved words get a trailing `_` (`package_`).
- Register once, at startup (in Angular: `main.ts`). Elements already on the page draw themselves when their icon is registered.
- A name that is still not registered when the page has loaded prints a warning in the console.
- Without the registry: set the property, `el.icon = mail`.

## Size and colour

16px by default (`width/height: 1rem` in `kaamos.css`); change it with a class: `size-5`, `size-6`. The stroke is `currentColor`, so the icon follows the text colour (`text-mute`, `text-on-dark`). Lucide is drawn on a 24×24 grid with a 2px stroke, which scales with the size.

## Accessibility

|                  | Result                                                       |
| ---------------- | ------------------------------------------------------------ |
| no `label`       | decorative: `aria-hidden="true"`, screen readers skip it     |
| `label="Unread"` | `role="img"` + `aria-label`, read as an image with that name |

An icon-only button needs its name on the button (`aria-label`), not on the icon.

## Attributes and properties

|                   |                                                            |
| ----------------- | ---------------------------------------------------------- |
| `name`            | a registered icon                                          |
| `label`           | text for screen readers; without it the icon is decorative |
| `icon` (property) | the icon itself (`IconNode`), wins over `name`             |
| `refresh()`       | redraws the icon                                           |

## Inside the components

The library's own components (search bar, command palette, select) use Lucide too, through `iconMarkup(node, classes)`: it turns an icon into `<svg>` markup for their static templates. `createIconSvg(node)` does the same with the DOM API.

## License

Lucide: ISC License (icons derived from Feather: MIT), shipped with the tokens package.

## See also

- [Search bar](search-bar.md)
- [Decisions](../decisions.md#lucide-icons-with-a-registry)
