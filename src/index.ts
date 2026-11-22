/**
 * @kaamos/webcomponents
 *
 * Importare questo modulo registra tutti i custom element.
 * Lo stile arriva dal CSS: importa "@kaamos/webcomponents/kaamos.css".
 */
import { KaamosButton } from "./components/button/button.ts";
import { KaamosSearchBar } from "./components/search-bar/search-bar.ts";
import { KaamosTextInput } from "./components/text-input/text-input.ts";

export { KaamosButton, KaamosSearchBar, KaamosTextInput };
export type { ButtonVariant } from "./components/button/button.ts";

/** Registra un elemento solo se non esiste già (evita errori se il bundle è caricato due volte). */
function define(tag: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

define("kaamos-button", KaamosButton);
define("kaamos-text-input", KaamosTextInput);
define("kaamos-search-bar", KaamosSearchBar);
