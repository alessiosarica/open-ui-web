# Text input · `<kaamos-text-input>`

Campo di testo su una riga. Dentro crea un `<input>` nativo, che partecipa al `<form>` e alla validazione del browser.

```html
<label>
  Email
  <kaamos-text-input
    name="email"
    type="email"
    placeholder="tu@esempio.org"
    required
  ></kaamos-text-input>
</label>
```

Puoi avvolgerlo in una `<label>`: grazie al light DOM l'input interno è un vero discendente della label, quindi cliccando sul testo il focus va all'input.

## Attributi

| Attributo                                          | Note                                                             |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| `type`                                             | `text` (default), `email`, `password`, `url`, `tel`, `number`... |
| `name`, `placeholder`, `autocomplete`, `inputmode` | inoltrati all'input                                              |
| `minlength`, `maxlength`, `pattern`                | validazione nativa                                               |
| `value`                                            | valore **iniziale** (come l'attributo dell'input nativo)         |
| `required`, `disabled`, `readonly`                 | booleani                                                         |
| `aria-label`, `aria-describedby`                   | per l'accessibilità quando non c'è una label visibile            |

## Proprietà ed eventi

```js
const el = document.querySelector("kaamos-text-input");
el.value; // valore attuale
el.value = "ciao";
el.focus();
el.addEventListener("input", (e) => console.log(e.target.value)); // gli eventi nativi salgono fino al tag
```

## Stile

Altezza 36px, sfondo `surface-elevated`, bordo `hairline`. Al focus il bordo diventa `hairline-strong`: una leggera schiarita, non un anello colorato.

## Angular

Aggiungi `ngDefaultControl` al tag: Angular userà il suo adattatore standard per i campi di testo.

```html
<kaamos-text-input name="email" ngDefaultControl [(ngModel)]="email"></kaamos-text-input>
<kaamos-text-input formControlName="nome" ngDefaultControl></kaamos-text-input>
```

Perché funziona tutto:

| Cosa fa Angular                               | Come lo gestisce il componente                                              |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| Scrive il valore: `tag.value = ...`           | setter `value`                                                              |
| Ascolta `input` sul tag                       | l'evento del campo interno risale al tag (light DOM)                        |
| Ascolta `blur` sul tag per lo stato "touched" | `blur` non risale, quindi il componente lo riemette sul tag                 |
| `form.disable()` fa `tag.disabled = true`     | proprietà `disabled` (e `required`, `readOnly`) che riflette sull'attributo |

Lo stesso vale per [`kaamos-search-bar`](search-bar.md).
