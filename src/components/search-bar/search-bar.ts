/**
 * <kaamos-search-bar>  —  DA IMPLEMENTARE (esercizio per Alessio)
 *
 * Dal DESIGN.md (store-search-bar):
 *   - sfondo surface-elevated, testo on-dark, tipografia body-md
 *   - padding 10px 16px, altezza ~44px, rounded md
 *   - icona lente a SINISTRA, placeholder "Search..."
 *   - è più alto del text-input normale (44px vs 36px)
 *
 * Uso atteso:
 *   <kaamos-search-bar name="q" placeholder="Search..."></kaamos-search-bar>
 *
 * Suggerimenti (non soluzioni):
 *   1. Parti da ../text-input/text-input.ts: la struttura (input interno,
 *      attributi inoltrati, getter/setter value) è quasi uguale.
 *   2. Qui hai DUE elementi: l'icona e l'input. Chi dei due deve avere
 *      sfondo e bordo arrotondato? Pensa a un contenitore che li affianca.
 *   3. L'icona: SVG inline (niente font di icone esterni). Deve avere
 *      aria-hidden="true": perché? Cosa leggerebbe uno screen reader altrimenti?
 *   4. Che type deve avere l'<input>? Guarda cosa cambia con type="search"
 *      (tasto Esc, tastiera su mobile, ruolo per gli screen reader).
 *   5. Altezza 44px: con la griglia da 4px di Tailwind, che classe è?
 *      E per py 10px / px 16px?
 *   6. Ricorda: classi scritte intere, niente "h-" + qualcosa.
 *   7. Quando hai finito: registra il tag in ../../index.ts, aggiungi un
 *      esempio in index.html e un test in search-bar.test.ts.
 */

export class KaamosSearchBar extends HTMLElement {
  // TODO
}

declare global {
  interface HTMLElementTagNameMap {
    "kaamos-search-bar": KaamosSearchBar;
  }
}
