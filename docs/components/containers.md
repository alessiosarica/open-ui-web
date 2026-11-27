[Home](../README.md) › [Components](../README.md#components) › Containers

# Containers: cards and main navigation

## Card

Three classes cover every card in DESIGN.md: the frame is the same, the content changes, and you build it with the token classes.

| Class                  | Matches (DESIGN.md)                               | Look                                                    |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| `kaamos-card`          | feature-card-dark, pricing-tier-card              | `surface`, `hairline` border, 24px padding, 10px radius |
| `kaamos-card-elevated` | feature-card-elevated, pricing-tier-card-featured | as above but `surface-elevated` (one step lighter)      |
| `kaamos-card-compact`  | store-extension-card                              | 16px padding, 8px radius, content in a row              |

```html
<article class="kaamos-card">
  <h3 class="text-heading-sm text-ink">Kaamos Mail</h3>
  <p class="text-body-sm text-mute">A free and fast email client.</p>
  <kaamos-button variant="secondary">Learn more →</kaamos-button>
</article>
```

Store card (icon, text, Install button):

```html
<article class="kaamos-card-compact">
  <span class="kaamos-app-icon-tile"><img src="sorter.svg" alt="" /></span>
  <div class="min-w-0 flex-1">
    <h3 class="text-body-strong text-ink">Mail Sorter</h3>
    <p class="text-caption-md text-mute">by Kaamos · Sort mail with local rules</p>
  </div>
  <kaamos-button variant="install">Install</kaamos-button>
</article>
```

Pricing cards: `kaamos-card` for normal plans, `kaamos-card-elevated` for the featured one (the only visual difference, as in DESIGN.md). Plan name in `text-heading-xl`, price in `text-display-lg`.

DESIGN.md uses no shadows: cards stand out from the background only through surface and border.

## Main navigation

A 56px top bar: logo on the left, links in the middle, actions on the right. Below 768px the links become a drawer that slides in from the left, opened by the hamburger button. No JavaScript needed.

```html
<header class="kaamos-nav">
  <button class="kaamos-nav-toggle" popovertarget="main-nav" aria-label="Open the menu">
    <!-- hamburger icon (SVG) -->
  </button>

  <a class="kaamos-nav-brand" href="/">Kaamos</a>

  <nav id="main-nav" popover class="kaamos-nav-links" aria-label="Main">
    <a class="kaamos-nav-link" href="/" aria-current="page">Home</a>
    <a class="kaamos-nav-link" href="/mail">Mail</a>
    <a class="kaamos-nav-link" href="/drive">Drive</a>
  </nav>

  <div class="flex items-center gap-3">
    <a class="kaamos-nav-link kaamos-nav-secondary" href="/login">Sign in</a>
    <kaamos-button variant="primary">Download</kaamos-button>
  </div>
</header>
```

| Class                  | Role                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| `kaamos-nav`           | The bar (`<header>`), stays at the top when you scroll           |
| `kaamos-nav-toggle`    | Hamburger button, visible only below 768px                       |
| `kaamos-nav-brand`     | Logo/name: centred on mobile, on the left on desktop             |
| `kaamos-nav-links`     | The `<nav popover>`: a drawer on mobile, a bar on desktop        |
| `kaamos-nav-link`      | A link. The current page's link has `aria-current="page"`        |
| `kaamos-nav-secondary` | Hides an action below 768px (the "Download" button always stays) |

**How it works**: the `<nav>` has the `popover` attribute. On mobile it is a real popover: it opens with the button and closes when you click outside or press Esc. On desktop the CSS forces it to always be visible as a normal bar.

## See also

- [Static classes](static.md): badges and app icon tiles inside cards
- [Button](button.md)
