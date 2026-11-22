# Contenitori: card e navigazione principale

## Card

Tre classi coprono tutte le card del DESIGN.md: la cornice è la stessa, cambia il contenuto, che costruisci con le classi dei token.

| Classe                 | Corrisponde a (DESIGN.md)                         | Aspetto                                                  |
| ---------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| `kaamos-card`          | feature-card-dark, pricing-tier-card              | `surface`, bordo `hairline`, padding 24px, raggio 10px   |
| `kaamos-card-elevated` | feature-card-elevated, pricing-tier-card-featured | come sopra ma `surface-elevated` (un gradino più chiara) |
| `kaamos-card-compact`  | store-extension-card                              | padding 16px, raggio 8px, contenuto in riga              |

```html
<article class="kaamos-card">
  <h3 class="text-heading-sm text-ink">Kaamos Mail</h3>
  <p class="text-body-sm text-mute">Un client email libero e veloce.</p>
  <kaamos-button variant="secondary">Learn more →</kaamos-button>
</article>
```

Card dello store (icona, testo, bottone Install):

```html
<article class="kaamos-card-compact">
  <span class="kaamos-app-icon-tile"><img src="sorter.svg" alt="" /></span>
  <div class="min-w-0 flex-1">
    <h3 class="text-body-strong text-ink">Mail Sorter</h3>
    <p class="text-caption-md text-mute">di Kaamos · Ordina la posta con regole locali</p>
  </div>
  <kaamos-button variant="install">Install</kaamos-button>
</article>
```

Card dei prezzi: `kaamos-card` per i piani normali, `kaamos-card-elevated` per quello in evidenza (l'unica differenza visiva, come da DESIGN.md). Nome del piano in `text-heading-xl`, prezzo in `text-display-lg`.

Il DESIGN.md non usa ombre: le card si staccano dallo sfondo solo con la superficie e il bordo.

## Navigazione principale

Barra in alto da 56px: logo a sinistra, link al centro, azioni a destra. Sotto i 768px i link diventano un cassetto che entra da sinistra, aperto dal bottone hamburger. Non serve JavaScript.

```html
<header class="kaamos-nav">
  <button class="kaamos-nav-toggle" popovertarget="nav-principale" aria-label="Apri il menu">
    <!-- icona hamburger (SVG) -->
  </button>

  <a class="kaamos-nav-brand" href="/">Kaamos</a>

  <nav id="nav-principale" popover class="kaamos-nav-links" aria-label="Principale">
    <a class="kaamos-nav-link" href="/" aria-current="page">Home</a>
    <a class="kaamos-nav-link" href="/mail">Mail</a>
    <a class="kaamos-nav-link" href="/drive">Drive</a>
  </nav>

  <div class="flex items-center gap-3">
    <a class="kaamos-nav-link kaamos-nav-secondary" href="/login">Accedi</a>
    <kaamos-button variant="primary">Download</kaamos-button>
  </div>
</header>
```

| Classe                 | Ruolo                                                              |
| ---------------------- | ------------------------------------------------------------------ |
| `kaamos-nav`           | La barra (`<header>`), resta in alto quando scorri                 |
| `kaamos-nav-toggle`    | Bottone hamburger, visibile solo sotto 768px                       |
| `kaamos-nav-brand`     | Logo/nome: al centro su mobile, a sinistra su desktop              |
| `kaamos-nav-links`     | Il `<nav popover>`: cassetto su mobile, barra su desktop           |
| `kaamos-nav-link`      | Un link. Quello della pagina attuale ha `aria-current="page"`      |
| `kaamos-nav-secondary` | Nasconde un'azione sotto 768px (il "Download" invece resta sempre) |

**Come funziona**: il `<nav>` ha l'attributo `popover`. Su mobile è un vero popover: si apre col bottone, si chiude cliccando fuori o con Esc. Su desktop il CSS lo forza a essere sempre visibile come una barra normale.
