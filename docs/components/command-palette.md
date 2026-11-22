# Command palette · `<kaamos-command-palette>`

La "palette dei comandi": si apre con ⌘K (Ctrl+K su Linux e Windows), scrivi per filtrare, ti muovi con le frecce e scegli con Invio. È il componente simbolo del DESIGN.md.

```html
<kaamos-command-palette shortcut="k" placeholder="Cerca un comando...">
  <button value="nuova-email">Nuova email <kbd class="kaamos-keycap">⌘ N</kbd></button>
  <button value="cerca">Cerca nella posta</button>
  <button value="impostazioni">Impostazioni</button>
</kaamos-command-palette>
```

```js
const palette = document.querySelector("kaamos-command-palette");
palette.addEventListener("kaamos-select", (event) => {
  esegui(event.detail.item.value); // il <button> scelto
});
```

## Attributi

| Attributo     | Note                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------- |
| `shortcut`    | Lettera da premere con ⌘/Ctrl per aprire e chiudere. Senza, la palette si apre solo da JS |
| `placeholder` | Testo nel campo di ricerca. Default "Cerca un comando..."                                 |
| `aria-label`  | Nome del campo per gli screen reader. Default "Comandi"                                   |

## Righe

Ogni `<button>` figlio è una riga. Il `value` ti dice quale comando è stato scelto. Una `kbd.kaamos-keycap` dentro la riga va allineata a destra, un'icona (`svg` o `kaamos-app-icon-tile`) a sinistra.

Il filtro cerca il testo della riga, senza distinguere maiuscole e minuscole.

## Proprietà, metodi ed eventi

| Nome                | Note                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| `show()`, `close()` | Apre e chiude la palette                                                        |
| `open`              | `true` se è aperta                                                              |
| `rows`              | Tutte le righe                                                                  |
| `kaamos-select`     | Evento: una riga è stata scelta (`event.detail.item`). Poi la palette si chiude |

## Accessibilità

Usa il pattern ARIA "combobox + listbox": il focus resta sempre nel campo di ricerca, così puoi continuare a scrivere, e `aria-activedescendant` dice allo screen reader quale riga è attiva. Il contenitore è un `<dialog>` modale: il resto della pagina è inerte finché la palette è aperta.
