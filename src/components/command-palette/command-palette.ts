/**
 * <kaamos-command-palette>
 *
 * La "palette dei comandi": si apre con ⌘K / Ctrl+K, scrivi per filtrare,
 * frecce per muoverti, Invio per scegliere. È il componente simbolo del
 * DESIGN.md (command-palette-card + command-palette-row).
 *
 *   <kaamos-command-palette shortcut="k" placeholder="Cerca un comando...">
 *     <button value="nuova-email">Nuova email <kbd class="kaamos-keycap">⌘ N</kbd></button>
 *     <button value="cerca">Cerca nella posta</button>
 *   </kaamos-command-palette>
 *
 * Mattoni usati:
 *   - <dialog> + showModal(): focus intrappolato, Esc, pagina inerte
 *   - pattern ARIA "combobox + listbox": il focus resta SEMPRE nell'input,
 *     e aria-activedescendant dice allo screen reader quale riga è attiva.
 *     Così puoi continuare a scrivere mentre ti muovi con le frecce.
 */

import { search } from "@kaamos-project/open-design-tokens/icons";
import { iconMarkup } from "../icon/icon.ts";

const ROW_SELECTOR = "button";

/* Template statico: solo markup scritto da noi (vedi search-bar per il perché). */
const TEMPLATE = `
<dialog class="kaamos-command-palette">
  <div class="flex items-center gap-3 border-b border-hairline px-4">
    ${iconMarkup(search, "size-4 shrink-0 text-mute")}
    <input class="h-12 flex-1 min-w-0 bg-transparent text-body-md text-on-dark outline-none placeholder:text-mute"
           type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" autocomplete="off" />
  </div>
  <div class="max-h-80 overflow-y-auto p-1" role="listbox"></div>
  <p hidden class="px-4 py-6 text-center text-body-sm text-mute" data-empty>Nessun risultato</p>
  <div class="flex items-center justify-end gap-4 border-t border-hairline px-4 py-2 text-caption-sm text-mute">
    <span class="flex items-center gap-1.5"><kbd class="kaamos-keycap">↑</kbd><kbd class="kaamos-keycap">↓</kbd> muoviti</span>
    <span class="flex items-center gap-1.5"><kbd class="kaamos-keycap">⏎</kbd> scegli</span>
    <span class="flex items-center gap-1.5"><kbd class="kaamos-keycap">Esc</kbd> chiudi</span>
  </div>
</dialog>`;

let nextId = 0;

export class KaamosCommandPalette extends HTMLElement {
  static observedAttributes: string[] = ["placeholder", "aria-label"];

  #dialog: HTMLDialogElement | null = null;
  #input: HTMLInputElement | null = null;
  #list: HTMLElement | null = null;
  #empty: HTMLElement | null = null;
  #observer: MutationObserver | null = null;
  #active = 0;

  connectedCallback(): void {
    if (!this.#dialog) {
      // Le righe scritte dall'utente vengono spostate dentro la listbox.
      const rows = Array.from(this.children);
      this.insertAdjacentHTML("beforeend", TEMPLATE);
      this.#dialog = this.querySelector("dialog");
      this.#input = this.querySelector("input");
      this.#list = this.querySelector('[role="listbox"]');
      this.#empty = this.querySelector("[data-empty]");
      this.#list?.append(...rows);

      const listId = `kaamos-palette-list-${++nextId}`;
      this.#list?.setAttribute("id", listId);
      this.#input?.setAttribute("aria-controls", listId);

      this.#input?.addEventListener("input", () => this.#filter());
      this.#input?.addEventListener("keydown", this.#onKeyDown);
      this.#list?.addEventListener("click", this.#onClick);
      this.#dialog?.addEventListener("close", () => this.#reset());
    }

    this.#decorateRows();
    this.#observer = new MutationObserver(() => {
      // Righe aggiunte dopo (es. da un framework) direttamente nel tag.
      for (const child of Array.from(this.children)) {
        if (child !== this.#dialog) this.#list?.append(child);
      }
      this.#decorateRows();
    });
    this.#observer.observe(this, { childList: true });
    document.addEventListener("keydown", this.#onGlobalKeyDown);
    this.#render();
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = null;
    document.removeEventListener("keydown", this.#onGlobalKeyDown);
  }

  attributeChangedCallback(): void {
    this.#render();
  }

  get open(): boolean {
    return this.#dialog?.open ?? false;
  }

  show(): void {
    if (!this.#dialog || this.#dialog.open) return;
    this.#dialog.showModal();
    this.#filter();
    this.#input?.focus();
  }

  close(): void {
    this.#dialog?.close();
  }

  /** Tutte le righe (anche quelle nascoste dal filtro). */
  get rows(): HTMLButtonElement[] {
    return Array.from(this.#list?.querySelectorAll<HTMLButtonElement>(ROW_SELECTOR) ?? []);
  }

  get #visibleRows(): HTMLButtonElement[] {
    return this.rows.filter((row) => !row.hidden && !row.disabled);
  }

  #render(): void {
    if (!this.#input) return;
    this.#input.placeholder = this.getAttribute("placeholder") ?? "Cerca un comando...";
    this.#input.setAttribute("aria-label", this.getAttribute("aria-label") ?? "Comandi");
  }

  #decorateRows(): void {
    for (const row of this.rows) {
      row.type = "button";
      row.setAttribute("role", "option");
      row.classList.add("kaamos-command-row");
      row.tabIndex = -1;
      if (!row.id) row.id = `kaamos-command-${++nextId}`;
    }
  }

  #filter(): void {
    const query = (this.#input?.value ?? "").trim().toLowerCase();
    for (const row of this.rows) {
      row.hidden = query !== "" && !(row.textContent ?? "").toLowerCase().includes(query);
    }
    if (this.#empty) this.#empty.hidden = this.#visibleRows.length > 0;
    this.#setActive(0);
  }

  #setActive(index: number): void {
    const rows = this.#visibleRows;
    for (const row of this.rows) row.setAttribute("aria-selected", "false");
    if (rows.length === 0) {
      this.#input?.removeAttribute("aria-activedescendant");
      return;
    }
    this.#active = (index + rows.length) % rows.length;
    const row = rows[this.#active];
    if (!row) return;
    row.setAttribute("aria-selected", "true");
    this.#input?.setAttribute("aria-activedescendant", row.id);
    row.scrollIntoView?.({ block: "nearest" });
  }

  #choose(row: HTMLButtonElement): void {
    this.dispatchEvent(new CustomEvent("kaamos-select", { detail: { item: row }, bubbles: true }));
    this.close();
  }

  #reset(): void {
    if (this.#input) this.#input.value = "";
    this.#filter();
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case "ArrowDown":
        this.#setActive(this.#active + 1);
        break;
      case "ArrowUp":
        this.#setActive(this.#active - 1);
        break;
      case "Enter": {
        const row = this.#visibleRows[this.#active];
        if (row) this.#choose(row);
        break;
      }
      default:
        return;
    }
    event.preventDefault();
  };

  #onClick = (event: MouseEvent): void => {
    const row = (event.target as Element).closest<HTMLButtonElement>(ROW_SELECTOR);
    if (row && !row.disabled) this.#choose(row);
  };

  /** ⌘K su macOS, Ctrl+K altrove (la lettera viene dall'attributo shortcut). */
  #onGlobalKeyDown = (event: KeyboardEvent): void => {
    const key = this.getAttribute("shortcut");
    if (!key || !(event.metaKey || event.ctrlKey)) return;
    if (event.key.toLowerCase() !== key.toLowerCase()) return;
    event.preventDefault();
    if (this.open) this.close();
    else this.show();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "kaamos-command-palette": KaamosCommandPalette;
  }
}
