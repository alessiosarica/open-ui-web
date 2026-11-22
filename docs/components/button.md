# Button · `<kaamos-button>`

Bottone d'azione. Dentro crea un `<button>` nativo: tastiera, focus e form funzionano come un bottone normale.

```html
<kaamos-button variant="primary">Download</kaamos-button>
<kaamos-button variant="secondary">Learn more →</kaamos-button>
<kaamos-button variant="tertiary">Watch demo</kaamos-button>
<kaamos-button variant="install">Install</kaamos-button>
<kaamos-button variant="primary" disabled>Download</kaamos-button>
```

## Attributi

| Attributo                    | Valori                                        | Default   | Note                                                                    |
| ---------------------------- | --------------------------------------------- | --------- | ----------------------------------------------------------------------- |
| `variant`                    | `primary`, `secondary`, `tertiary`, `install` | `primary` | Valore sconosciuto → `primary`                                          |
| `disabled`                   | booleano                                      | assente   | Stesso stile per tutte le varianti                                      |
| `type`                       | `button`, `submit`, `reset`                   | `button`  | Diverso dal `<button>` nativo (che è `submit`): evita invii per sbaglio |
| `name`, `value`, `form`      | come il `<button>` nativo                     |           | Inoltrati al bottone interno                                            |
| `aria-label`, `aria-pressed` |                                               |           | Inoltrati al bottone interno                                            |

## Proprietà JavaScript

```js
const el = document.querySelector("kaamos-button");
el.variant = "tertiary";
el.disabled = true;
el.focus(); // mette il focus sul bottone interno
el.button; // il <button> nativo
```

## Linee guida (DESIGN.md)

- **Un solo `primary` per schermata**: il bianco è riservato all'azione principale.
- `secondary` per azioni leggere ("Learn more →"), `tertiary` per azioni medie dentro le card, `install` sulle card dello store.
- Altezza 36px (install 32px), già sopra la soglia WCAG AA per i target touch.

## Dentro un form

```html
<form>
  <kaamos-text-input name="email" type="email"></kaamos-text-input>
  <kaamos-button variant="primary" type="submit">Iscriviti</kaamos-button>
</form>
```
