/**
 * <kaamos-menu>  —  dropdown menu
 *
 * È un popover nativo (attributo popover) con il comportamento da tastiera
 * del pattern ARIA "menu": il browser ci dà apertura, chiusura con Esc,
 * chiusura cliccando fuori e il top layer. Noi aggiungiamo solo quello
 * che manca: ruoli ARIA e frecce su/giù.
 *
 *   <kaamos-button variant="tertiary" popovertarget="azioni">Azioni</kaamos-button>
 *   <kaamos-menu id="azioni" aria-label="Azioni sul file">
 *     <button>Rinomina</button>
 *     <button>Duplica <kbd class="kaamos-keycap">⌘ D</kbd></button>
 *     <hr />
 *     <button>Elimina</button>
 *   </kaamos-menu>
 *
 * Quando scegli una voce, il menu emette l'evento "kaamos-select" con
 * detail.item = il <button> scelto, e si chiude.
 */

const ITEM_SELECTOR = "button";

export class KaamosMenu extends HTMLElement {
  #observer: MutationObserver | null = null;

  connectedCallback(): void {
    if (!this.hasAttribute("popover")) this.setAttribute("popover", "auto");
    this.setAttribute("role", "menu");
    this.classList.add("kaamos-menu");

    this.#decorateItems();
    // Le voci possono arrivare dopo (framework): le decoriamo quando cambiano.
    this.#observer = new MutationObserver(() => this.#decorateItems());
    this.#observer.observe(this, { childList: true });

    this.addEventListener("keydown", this.#onKeyDown);
    this.addEventListener("click", this.#onClick);
    this.addEventListener("toggle", this.#onToggle);
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = null;
    this.removeEventListener("keydown", this.#onKeyDown);
    this.removeEventListener("click", this.#onClick);
    this.removeEventListener("toggle", this.#onToggle);
  }

  /** Le voci attive (non disabilitate), nell'ordine del DOM. */
  get items(): HTMLButtonElement[] {
    return Array.from(this.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR)).filter(
      (item) => !item.disabled,
    );
  }

  #decorateItems(): void {
    for (const item of this.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR)) {
      item.type = "button";
      item.setAttribute("role", "menuitem");
      item.classList.add("kaamos-menu-item");
      // "Roving tabindex": Tab esce dal menu, le frecce si muovono dentro.
      item.tabIndex = -1;
    }
    for (const separator of this.querySelectorAll("hr")) {
      separator.setAttribute("role", "separator");
      separator.classList.add("kaamos-menu-separator");
    }
  }

  #focusItem(index: number): void {
    const items = this.items;
    if (items.length === 0) return;
    // Il modulo fa "girare" l'indice: dall'ultima voce si torna alla prima.
    const wrapped = (index + items.length) % items.length;
    items[wrapped]?.focus();
  }

  #onToggle = (event: Event): void => {
    // All'apertura il focus va sulla prima voce, come nei menu delle app desktop.
    if ((event as ToggleEvent).newState === "open") this.#focusItem(0);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const items = this.items;
    const current = items.indexOf(document.activeElement as HTMLButtonElement);

    switch (event.key) {
      case "ArrowDown":
        this.#focusItem(current + 1);
        break;
      case "ArrowUp":
        this.#focusItem(current - 1);
        break;
      case "Home":
        this.#focusItem(0);
        break;
      case "End":
        this.#focusItem(items.length - 1);
        break;
      case "Tab":
        // Tab chiude il menu e lascia proseguire il focus.
        this.hidePopover();
        return;
      default:
        return;
    }
    event.preventDefault();
  };

  #onClick = (event: MouseEvent): void => {
    const item = (event.target as Element).closest<HTMLButtonElement>(ITEM_SELECTOR);
    if (!item || item.disabled || !this.contains(item)) return;
    this.dispatchEvent(new CustomEvent("kaamos-select", { detail: { item }, bubbles: true }));
    this.hidePopover();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "kaamos-menu": KaamosMenu;
  }
  interface HTMLElementEventMap {
    "kaamos-select": CustomEvent<{ item: HTMLButtonElement }>;
  }
}
