# Classi statiche

Componenti senza comportamento: sono classi CSS da mettere sull'elemento HTML giusto. Nessun JavaScript, quindi nessun costo a runtime. Funzionano anche con le varianti di Tailwind (`hover:`, `md:`...) se usi Tailwind nel tuo progetto.

## Badge

```html
<span class="kaamos-badge-pro">Pro</span> <span class="kaamos-badge-info">Beta</span>
```

| Classe              | Uso                                                            |
| ------------------- | -------------------------------------------------------------- |
| `kaamos-badge-pro`  | Piano o livello: "Pro", "Pro+", "Free"                         |
| `kaamos-badge-info` | Etichetta rara: "New", "Beta". Usa l'accento blu: tienila rara |

## Keycap

Scorciatoie da tastiera. Usa sempre l'elemento `<kbd>`, che per gli screen reader significa "tasto".

```html
<kbd class="kaamos-keycap">⌘</kbd> <kbd class="kaamos-keycap">K</kbd>
<kbd class="kaamos-keycap">Esc</kbd>
```

## App icon tile

Riquadro per l'icona di un'app o integrazione. L'immagine o l'SVG dentro riempie tutto il riquadro.

```html
<span class="kaamos-app-icon-tile"><img src="mail.svg" alt="Kaamos Mail" /></span>
<span class="kaamos-app-icon-tile-lg"><img src="drive.svg" alt="Kaamos Drive" /></span>
```

| Classe                    | Misura |
| ------------------------- | ------ |
| `kaamos-app-icon-tile`    | 48×48  |
| `kaamos-app-icon-tile-lg` | 64×64  |

Se l'icona è solo decorativa (il nome dell'app è già scritto accanto), usa `alt=""`.

## Pill tab

Chip di filtro, da usare su `<button>`. Lo stato attivo **non** è una classe ma un attributo ARIA: così lo stile segue sempre quello che sente uno screen reader.

```html
<div role="group" aria-label="Filtra estensioni">
  <button class="kaamos-pill-tab" aria-pressed="true">All</button>
  <button class="kaamos-pill-tab" aria-pressed="false">Recently Added</button>
  <button class="kaamos-pill-tab" aria-pressed="false">Most Popular</button>
</div>
```

- Filtri che si accendono e spengono: `aria-pressed="true|false"`, e aggiornalo dal tuo codice al click.
- Dentro un gruppo di tab (`role="tablist"`): `aria-selected="true|false"`. Il componente tab arriverà in un lotto successivo.
