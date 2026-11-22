/**
 * <kaamos-tabs>
 *
 * Non esiste un elemento HTML nativo per le tab, quindi implementiamo il
 * pattern ARIA "tabs": tablist / tab / tabpanel, con le frecce per muoversi.
 * Lo stile delle tab è la classe kaamos-pill-tab del DESIGN.md.
 *
 *   <kaamos-tabs>
 *     <div aria-label="Impostazioni">       <- primo figlio: la lista delle tab
 *       <button>Generale</button>
 *       <button>Account</button>
 *     </div>
 *     <section>Contenuto Generale</section>  <- gli altri figli: i pannelli,
 *     <section>Contenuto Account</section>      nello stesso ordine delle tab
 *   </kaamos-tabs>
 *
 * Attributo `selected`: indice della tab attiva (default 0).
 * Evento `kaamos-change`: detail.index quando l'utente cambia tab.
 */

let nextId = 0;

/** Dà un id all'elemento se non ce l'ha: serve per collegare tab e pannelli. */
function ensureId(element: Element, prefix: string): string {
  if (!element.id) element.id = `${prefix}-${++nextId}`;
  return element.id;
}

export class KaamosTabs extends HTMLElement {
  static observedAttributes: string[] = ["selected"];

  #observer: MutationObserver | null = null;

  connectedCallback(): void {
    this.#setup();
    this.#observer = new MutationObserver(() => this.#setup());
    this.#observer.observe(this, { childList: true });
    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeyDown);
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = null;
    this.removeEventListener("click", this.#onClick);
    this.removeEventListener("keydown", this.#onKeyDown);
  }

  attributeChangedCallback(): void {
    this.#render();
  }

  get selected(): number {
    const value = Number.parseInt(this.getAttribute("selected") ?? "0", 10);
    return Number.isNaN(value) ? 0 : value;
  }
  set selected(index: number) {
    this.setAttribute("selected", String(index));
  }

  get #tablist(): Element | null {
    return this.firstElementChild;
  }

  get tabs(): HTMLButtonElement[] {
    return Array.from(this.#tablist?.querySelectorAll<HTMLButtonElement>("button") ?? []);
  }

  get panels(): HTMLElement[] {
    return Array.from(this.children).slice(1) as HTMLElement[];
  }

  #setup(): void {
    const tablist = this.#tablist;
    if (!tablist) return;
    tablist.setAttribute("role", "tablist");
    tablist.classList.add("flex", "flex-wrap", "gap-1");

    const tabs = this.tabs;
    const panels = this.panels;
    tabs.forEach((tab, i) => {
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.classList.add("kaamos-pill-tab");
      const panel = panels[i];
      if (panel) {
        panel.setAttribute("role", "tabpanel");
        panel.classList.add(
          "mt-4",
          "rounded-md",
          "focus-visible:outline-2",
          "focus-visible:outline-offset-4",
          "focus-visible:outline-on-dark-mute",
        );
        tab.setAttribute("aria-controls", ensureId(panel, "kaamos-panel"));
        panel.setAttribute("aria-labelledby", ensureId(tab, "kaamos-tab"));
      }
    });
    this.#render();
  }

  #render(): void {
    const index = this.selected;
    this.tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      // Roving tabindex: solo la tab attiva è raggiungibile con Tab,
      // poi Tab successivo porta dentro il pannello.
      tab.tabIndex = active ? 0 : -1;
    });
    this.panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      // Il pannello riceve il focus con Tab se non contiene elementi focusabili.
      panel.tabIndex = 0;
    });
  }

  #select(index: number, focus: boolean): void {
    const tabs = this.tabs;
    if (tabs.length === 0) return;
    const wrapped = (index + tabs.length) % tabs.length;
    const changed = wrapped !== this.selected;
    this.selected = wrapped;
    if (focus) tabs[wrapped]?.focus();
    if (changed) {
      this.dispatchEvent(
        new CustomEvent("kaamos-change", { detail: { index: wrapped }, bubbles: true }),
      );
    }
  }

  #onClick = (event: MouseEvent): void => {
    const tab = (event.target as Element).closest<HTMLButtonElement>('[role="tab"]');
    if (!tab || tab.disabled) return;
    const index = this.tabs.indexOf(tab);
    if (index >= 0) this.#select(index, false);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const current = this.tabs.indexOf(event.target as HTMLButtonElement);
    if (current < 0) return; // il tasto è stato premuto dentro un pannello

    // Attivazione automatica: la tab si attiva appena ci arrivi con le frecce.
    switch (event.key) {
      case "ArrowRight":
        this.#select(current + 1, true);
        break;
      case "ArrowLeft":
        this.#select(current - 1, true);
        break;
      case "Home":
        this.#select(0, true);
        break;
      case "End":
        this.#select(this.tabs.length - 1, true);
        break;
      default:
        return;
    }
    event.preventDefault();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "kaamos-tabs": KaamosTabs;
  }
  interface HTMLElementEventMap {
    "kaamos-change": CustomEvent<{ index: number }>;
  }
}
