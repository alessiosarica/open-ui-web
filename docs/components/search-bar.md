# Search bar · `<kaamos-search-bar>`

Campo di ricerca con la lente a sinistra, più alto del text input (44px). Usa `<input type="search">`: Esc svuota il campo e su mobile la tastiera mostra il tasto "Cerca".

```html
<form action="/store">
  <kaamos-search-bar
    name="q"
    placeholder="Search..."
    aria-label="Cerca estensioni"
  ></kaamos-search-bar>
</form>
```

Premendo Invio il form viene inviato, senza codice extra.

## Accessibilità

Il placeholder **non** è un'etichetta: sparisce quando scrivi e molti screen reader non lo leggono. Dai sempre un `aria-label`.

Non mettere la search bar dentro una `<label>`: il componente usa già una label come contenitore (così cliccando la lente il focus va all'input), e le label annidate non sono valide.

## Attributi

`name`, `placeholder`, `value`, `autocomplete`, `minlength`, `maxlength`, `aria-label`, `aria-describedby`, `required`, `disabled`, `readonly`.

## Proprietà ed eventi

Come il [text input](text-input.md): `value`, `disabled`, `required`, `readOnly`, `focus()`, `input` (il campo nativo), eventi `input`/`change`/`blur`. Con Angular usa `ngDefaultControl` (vedi [text input](text-input.md#angular)).
