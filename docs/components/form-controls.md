# Controlli dei form: checkbox, select, slider

Sono **elementi nativi** (`<input>`, `<select>`) con una classe Kaamos. Il browser continua a gestire tastiera, form, validazione e screen reader. La classe cambia solo l'aspetto, grazie a `appearance: none`.

Un vantaggio in più: in Angular funzionano direttamente con `ngModel` e i reactive forms, senza adattatori.

## Checkbox

```html
<label>
  <input type="checkbox" class="kaamos-checkbox" name="news" checked />
  Ricevi le novità
</label>
```

- Selezionata: bianco `primary` con spunta nera, come il bottone principale.
- `disabled`: supportato.
- Stato "in parte" (es. "seleziona tutto" quando solo alcuni elementi sono selezionati): esiste solo da JavaScript.

```js
document.querySelector("#tutti").indeterminate = true;
```

Metti sempre la checkbox dentro una `<label>` (o collegala con `for`/`id`): così si clicca anche sul testo.

## Select

```html
<label>
  Lingua
  <select class="kaamos-select" name="lingua">
    <option value="it">Italiano</option>
    <option value="en">English</option>
  </select>
</label>
```

- Il campo chiuso ha lo stesso aspetto del [text input](text-input.md): 36px, `surface-elevated`, bordo `hairline`.
- **La lista che si apre**: nei browser che supportano il "customizable select" (oggi Chromium) è stilata con i token Kaamos. Negli altri browser appare la lista del sistema operativo. È un miglioramento progressivo: il select funziona ovunque, è solo più bello dove si può.

## Slider

```html
<label>
  Volume
  <input type="range" class="kaamos-range" name="volume" min="0" max="100" value="60" />
</label>
```

- Binario `hairline-strong` da 4px, cursore bianco da 16px.
- Supporta `min`, `max`, `step`, `disabled` come il range nativo.
- **Limite noto**: la parte "riempita" a sinistra del cursore non è colorata, perché Chrome e Safari non hanno uno pseudo-elemento per farlo solo con il CSS (Firefox sì). Per averla servirebbe un po' di JavaScript che aggiorna una variabile CSS a ogni movimento.
