# Controlli dei form: checkbox, select, slider

Checkbox e slider sono **elementi nativi** (`<input>`) con una classe Kaamos. Il select invece è un web component che avvolge un `<select>` nativo (vedi sotto). Il browser continua a gestire tastiera, form, validazione e screen reader. La classe cambia solo l'aspetto, grazie a `appearance: none`.

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

## Select · `<kaamos-select>`

Il select è l'unico controllo dei form che è un **web component**: la lista che si apre di un `<select>` nativo non si può stilare allo stesso modo in tutti i browser, quindi `kaamos-select` disegna la sua. Così l'aspetto è identico ovunque.

Dentro scrivi un normale `<select>`:

```html
<label>
  Lingua
  <kaamos-select>
    <select name="lingua" required>
      <option value="" hidden>Scegli una lingua</option>
      <optgroup label="Paesi nordici">
        <option value="fi">Suomi</option>
        <option value="sv">Svenska</option>
        <option value="is" disabled>Íslenska</option>
      </optgroup>
      <option value="it">Italiano</option>
    </select>
  </kaamos-select>
</label>
```

**Come funziona**: il `<select>` nativo resta nel DOM ma invisibile, ed è lui a contenere il valore. Il componente legge le sue `<option>`, disegna campo e lista, e quando scegli aggiorna il select ed emette `input` e `change` su di lui. Per questo funzionano senza codice extra:

- `FormData`, invio del form, `required` (il fumetto di errore del browser compare sul campo) e reset del form;
- `ngModel` e reactive forms di Angular, messi sul `<select>` interno;
- `select.value = "sv"` da JavaScript: il campo si aggiorna;
- `<optgroup>`, opzioni `disabled`, e un'opzione segnaposto con `value=""` e `hidden`;
- se il JavaScript non carica, l'utente vede un select nativo funzionante.

```js
const lingua = document.querySelector("kaamos-select select");
lingua.addEventListener("change", () => console.log(lingua.value));
```

**Tastiera** (pattern ARIA "select-only combobox", il focus resta sempre sul campo):

| Tasto            | Lista chiusa              | Lista aperta                                                       |
| ---------------- | ------------------------- | ------------------------------------------------------------------ |
| ↓ ↑ Invio Spazio | apre                      | ↓ ↑ si muovono (saltando le disabilitate), Invio e Spazio scelgono |
| Home / End       | apre sulla prima / ultima | prima / ultima opzione                                             |
| PagSu / PagGiù   |                           | salta di 10                                                        |
| Esc              |                           | chiude senza cambiare                                              |
| Tab              |                           | sceglie l'opzione attiva e prosegue                                |
| Lettere          | cambia subito valore      | sposta l'opzione attiva                                            |

**Ricerca digitando**: lettere diverse cercano l'inizio del testo ("sv" → Svenska); la stessa lettera ripetuta scorre le opzioni che iniziano con quella lettera ("s", "s" → Svenska, poi Suomi). Dopo mezzo secondo di pausa la ricerca ricomincia.

**Posizione**: la lista si apre sotto il campo, sopra se sotto non c'è spazio, larga almeno quanto il campo. Usa il CSS anchor positioning dove c'è, e un calcolo in JavaScript negli altri browser.

**Trade-off**: su mobile non compare il selettore di sistema (per esempio la "ruota" di iOS), ma la nostra lista.

**Attributi** sul tag: `aria-label`, `aria-labelledby`, `aria-describedby` (inoltrati al campo, se non usi una `<label>`). Tutto il resto (`name`, `required`, `disabled`...) va sul `<select>` interno.

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
