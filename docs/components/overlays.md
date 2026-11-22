# Overlay: dialog, popover, menu

Tutti e tre usano API native del browser, quindi apertura, chiusura con Esc e gestione del focus funzionano senza codice nostro.

| Componente | Cosa è                                 | Quando usarlo                                                 |
| ---------- | -------------------------------------- | ------------------------------------------------------------- |
| Dialog     | `<dialog class="kaamos-dialog">`       | Serve una risposta prima di continuare ("Eliminare il file?") |
| Popover    | `<div popover class="kaamos-popover">` | Informazioni o contenuto leggero vicino a un bottone          |
| Menu       | `<kaamos-menu>`                        | Lista di azioni che si apre da un bottone (dropdown menu)     |

Il DESIGN.md non usa ombre: gli overlay si staccano dalla pagina con la superficie `surface` e il bordo `hairline`.

## Dialog

```html
<kaamos-button commandfor="conferma" command="show-modal">Elimina</kaamos-button>

<dialog id="conferma" class="kaamos-dialog" aria-labelledby="conferma-titolo">
  <h2 id="conferma-titolo">Eliminare il file?</h2>
  <p>Potrai recuperarlo dal cestino per 30 giorni.</p>
  <form method="dialog">
    <kaamos-button variant="secondary" type="submit" value="annulla">Annulla</kaamos-button>
    <kaamos-button variant="primary" type="submit" value="elimina">Elimina</kaamos-button>
  </form>
</dialog>
```

- **Aprire**: `commandfor` + `command="show-modal"` sul bottone (Invoker Commands API, senza JS). In alternativa, da JS: `document.getElementById("conferma").showModal()`.
- **Chiudere**: un `<form method="dialog">` chiude il dialog quando viene inviato, e `dialog.returnValue` contiene il `value` del bottone premuto. Anche Esc lo chiude.
- **Leggere la scelta**:

```js
const dialog = document.getElementById("conferma");
dialog.addEventListener("close", () => {
  if (dialog.returnValue === "elimina") eliminaFile();
});
```

- Con `showModal()` il resto della pagina diventa inerte e il focus resta dentro il dialog. Dai sempre un titolo collegato con `aria-labelledby`.
- **Un solo bottone primary**: l'azione principale del dialog.

## Popover

```html
<kaamos-button variant="tertiary" popovertarget="info">Info</kaamos-button>

<div id="info" popover class="kaamos-popover">Testo di aiuto vicino al bottone.</div>
```

- Si apre e chiude col bottone, e si chiude cliccando fuori o con Esc.
- **Posizione**: con il CSS anchor positioning il popover si attacca sotto il bottone che lo apre e si gira da solo se non c'è spazio. Nei browser senza supporto appare al centro della finestra: funziona comunque.
- Da JS: `el.showPopover()`, `el.hidePopover()`, `el.togglePopover()`.

## Menu · `<kaamos-menu>`

```html
<kaamos-button variant="tertiary" popovertarget="azioni">Azioni</kaamos-button>

<kaamos-menu id="azioni" popover aria-label="Azioni sul file">
  <button>Rinomina</button>
  <button>Duplica <kbd class="kaamos-keycap">⌘ D</kbd></button>
  <button disabled>Sposta</button>
  <hr />
  <button>Elimina</button>
</kaamos-menu>
```

```js
document.getElementById("azioni").addEventListener("kaamos-select", (event) => {
  console.log("Scelto:", event.detail.item);
});
```

- **Voci**: ogni `<button>` diventa una voce (`role="menuitem"`), ogni `<hr>` un separatore. Una `kbd.kaamos-keycap` dentro la voce va allineata a destra.
- **Tastiera**: all'apertura il focus va sulla prima voce. ↑ ↓ si muovono (girando in tondo e saltando le voci disabilitate), Home ed End vanno a inizio e fine, Invio sceglie, Esc chiude, Tab chiude e prosegue.
- **Evento** `kaamos-select`: arriva quando scegli una voce, con `detail.item` = il bottone. Dopo il menu si chiude da solo.
- Scrivi l'attributo `popover` nell'HTML: così, se il JS non carica, il menu resta nascosto invece di comparire in mezzo alla pagina.
