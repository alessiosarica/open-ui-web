# Tab · `<kaamos-tabs>`

Per dividere un contenuto in sezioni, mostrandone una alla volta. Non esiste un elemento HTML nativo per le tab, quindi il componente implementa il pattern ARIA "tabs" (tablist, tab, tabpanel). Le tab hanno lo stile [`kaamos-pill-tab`](static.md#pill-tab).

```html
<kaamos-tabs>
  <div aria-label="Impostazioni account">
    <button>Generale</button>
    <button>Account</button>
    <button>Privacy</button>
  </div>
  <section>Lingua, tema e scorciatoie.</section>
  <section>Nome, email e password.</section>
  <section>Impostazioni della privacy.</section>
</kaamos-tabs>
```

## Struttura

- **Primo figlio**: la lista delle tab. Ogni `<button>` dentro è una tab. Dagli un `aria-label` che descrive il gruppo.
- **Figli successivi**: i pannelli, nello stesso ordine delle tab.

Il componente collega da solo tab e pannelli (`aria-controls`, `aria-labelledby`), generando gli id se mancano.

## Attributi, proprietà ed eventi

| Nome             | Tipo                     | Note                                             |
| ---------------- | ------------------------ | ------------------------------------------------ |
| `selected`       | attributo / proprietà    | Indice della tab attiva, parte da 0. Default `0` |
| `tabs`, `panels` | proprietà (sola lettura) | I bottoni e i pannelli                           |
| `kaamos-change`  | evento                   | Quando l'utente cambia tab. `event.detail.index` |

```js
const tabs = document.querySelector("kaamos-tabs");
tabs.selected = 2;
tabs.addEventListener("kaamos-change", (e) => console.log(e.detail.index));
```

## Tastiera

- **Tab**: entra nella tab attiva, il Tab successivo va dentro il pannello.
- **← →**: tab precedente e successiva, girando in tondo. La tab si attiva subito (attivazione automatica).
- **Home / End**: prima e ultima tab.

## Tab o pill tab da sole?

Usa `<kaamos-tabs>` quando ogni tab mostra un **pannello diverso**. Se invece i bottoni **filtrano la stessa lista** ("All", "Most Popular"), usa le [pill tab](static.md#pill-tab) con `aria-pressed`: per uno screen reader sono due cose diverse.
