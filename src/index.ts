/**
 * @kaamos/open-ui-web
 *
 * Importare questo modulo registra tutti i custom element.
 * Lo stile arriva dal CSS: importa "@kaamos/open-ui-web/kaamos.css".
 */
import { KaamosButton } from "./components/button/button.ts";
import { KaamosCommandPalette } from "./components/command-palette/command-palette.ts";
import { KaamosIcon } from "./components/icon/icon.ts";
import { KaamosMenu } from "./components/menu/menu.ts";
import { KaamosSearchBar } from "./components/search-bar/search-bar.ts";
import { KaamosSelect } from "./components/select/select.ts";
import { KaamosTabs } from "./components/tabs/tabs.ts";
import { KaamosTextInput } from "./components/text-input/text-input.ts";

export {
  KaamosButton,
  KaamosCommandPalette,
  KaamosIcon,
  KaamosMenu,
  KaamosSearchBar,
  KaamosSelect,
  KaamosTabs,
  KaamosTextInput,
};
export type { ButtonVariant } from "./components/button/button.ts";
export { createIconSvg, iconMarkup, registerIcons } from "./components/icon/icon.ts";
export type { IconNode } from "./components/icon/icon.ts";

/** Registra un elemento solo se non esiste già (evita errori se il bundle è caricato due volte). */
function define(tag: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

define("kaamos-button", KaamosButton);
define("kaamos-icon", KaamosIcon);
define("kaamos-text-input", KaamosTextInput);
define("kaamos-search-bar", KaamosSearchBar);
define("kaamos-menu", KaamosMenu);
define("kaamos-tabs", KaamosTabs);
define("kaamos-command-palette", KaamosCommandPalette);
define("kaamos-select", KaamosSelect);
