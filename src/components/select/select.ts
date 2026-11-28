/**
 * <kaamos-select>
 *
 * Un select con lo stesso aspetto in tutti i browser. Avvolge un <select>
 * NATIVO, che resta la fonte di verità:
 *
 *   <label>
 *     Lingua
 *     <kaamos-select>
 *       <select name="lingua" required>
 *         <option value="it">Italiano</option>
 *         <option value="en">English</option>
 *       </select>
 *     </kaamos-select>
 *   </label>
 *
 * Il componente nasconde il select e disegna sopra un campo e una lista
 * custom. Quando scegli, aggiorna il select vero ed emette "input" e
 * "change" su di lui. Così continuano a funzionare senza codice extra:
 * FormData, required, reset del form e ngModel di Angular.
 * Se il JS non carica, resta un select nativo funzionante.
 *
 * Pattern ARIA: "select-only combobox". Il focus resta SEMPRE sul campo;
 * aria-activedescendant dice allo screen reader quale opzione è attiva.
 */

import { check, chevronDown } from "@kaamos-project/open-design-tokens/icons";
import { iconMarkup } from "../icon/icon.ts";

const CHEVRON = iconMarkup(chevronDown);
const CHECK = iconMarkup(check);

/* Il select nativo resta nel DOM (per il form e per la validazione) ma
   invisibile e sotto il campo: così il fumetto di "campo obbligatorio"
   del browser appare nel punto giusto. */
const HIDDEN_SELECT = "absolute inset-0 size-full opacity-0 pointer-events-none";

/* Dopo quanto tempo la ricerca digitando ricomincia da capo (come i select nativi). */
const TYPEAHEAD_RESET_MS = 500;

let nextId = 0;

/** Il testo di un'opzione: l'attributo label se c'è, altrimenti il contenuto. */
const labelOf = (option: HTMLOptionElement | HTMLOptGroupElement): string =>
  (option.label || option.textContent || "").trim();

/** Il browser supporta il CSS anchor positioning? */
const supportsAnchor = (): boolean =>
  typeof CSS !== "undefined" && CSS.supports?.("position-area", "block-end") === true;

export class KaamosSelect extends HTMLElement {
  #select: HTMLSelectElement | null = null;
  #trigger: HTMLButtonElement | null = null;
  #label: HTMLSpanElement | null = null;
  #list: HTMLDivElement | null = null;
  #observer: MutationObserver | null = null;
  #active = -1;
  #typeahead = "";
  #typeaheadTimer = 0;
  #wasOpenOnPointerDown = false;

  connectedCallback(): void {
    const select = this.querySelector("select");
    if (!select) {
      // Il <select> può arrivare dopo (framework): riproviamo quando cambia il contenuto.
      this.#observer = new MutationObserver(() => {
        if (this.querySelector("select")) {
          this.#observer?.disconnect();
          this.connectedCallback();
        }
      });
      this.#observer.observe(this, { childList: true });
      return;
    }
    if (this.#select === select) return; // già inizializzato (elemento spostato nel DOM)
    this.#select = select;
    this.#build(select);
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = null;
    this.#select = null;
    this.#list?.remove();
    this.#trigger?.remove();
    this.#list = null;
    this.#trigger = null;
    window.removeEventListener("scroll", this.#position, true);
    window.removeEventListener("resize", this.#position);
  }

  /** Il <select> nativo avvolto. */
  get select(): HTMLSelectElement | null {
    return this.#select;
  }

  get value(): string {
    return this.#select?.value ?? "";
  }
  set value(value: string) {
    if (!this.#select) return;
    this.#select.value = value;
    this.#renderValue();
  }

  get open(): boolean {
    return this.#list?.matches(":popover-open") ?? false;
  }

  override focus(options?: FocusOptions): void {
    this.#trigger?.focus(options);
  }

  // ---------------------------------------------------------------------
  // Costruzione
  // ---------------------------------------------------------------------

  #build(select: HTMLSelectElement): void {
    const id = ++nextId;
    this.classList.add("relative");

    // Nascondiamo il select a tutti: occhi, mouse, tastiera e screen reader.
    select.className = `${select.className} ${HIDDEN_SELECT}`.trim();
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");

    // Il campo. Viene PRIMA del select: una <label> che avvolge il componente
    // si collega al primo elemento "etichettabile", cioè questo bottone.
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "kaamos-select-trigger";
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", `kaamos-select-list-${id}`);
    trigger.innerHTML = `<span class="truncate"></span>${CHEVRON}`;
    trigger.style.setProperty("anchor-name", `--kaamos-select-${id}`);
    for (const name of ["aria-label", "aria-labelledby", "aria-describedby"]) {
      const value = this.getAttribute(name);
      if (value) trigger.setAttribute(name, value);
    }
    this.#trigger = trigger;
    this.#label = trigger.querySelector("span");

    // La lista: un popover, così sta sopra a tutto e si chiude cliccando fuori.
    const list = document.createElement("div");
    list.id = `kaamos-select-list-${id}`;
    list.className = "kaamos-select-list";
    list.setAttribute("role", "listbox");
    list.setAttribute("popover", "auto");
    list.tabIndex = -1;
    list.style.setProperty("position-anchor", `--kaamos-select-${id}`);
    this.#list = list;

    this.prepend(trigger);
    this.append(list);

    trigger.addEventListener("pointerdown", () => {
      // Il popover si chiude da solo al pointerdown "fuori" (e il bottone è
      // fuori dalla lista). Ce lo segniamo, altrimenti il click successivo
      // lo riaprirebbe subito.
      this.#wasOpenOnPointerDown = this.open;
    });
    trigger.addEventListener("click", () => {
      if (this.#wasOpenOnPointerDown) {
        this.#wasOpenOnPointerDown = false;
        return;
      }
      this.#toggle();
    });
    trigger.addEventListener("keydown", this.#onKeyDown);
    list.addEventListener("click", this.#onOptionClick);
    list.addEventListener("toggle", this.#onToggle);
    // Il mouse sopra un'opzione la rende attiva, come nei select nativi.
    list.addEventListener("pointermove", (event) => {
      const option = (event.target as Element).closest<HTMLElement>('[role="option"]');
      if (option) this.#setActive(this.#options.indexOf(option), false);
    });

    // Validazione nativa: se il form è inviato con il campo vuoto e required,
    // mettiamo il focus sul nostro campo e lo segniamo come non valido.
    select.addEventListener("invalid", () => {
      trigger.setAttribute("aria-invalid", "true");
      trigger.focus();
    });
    select.addEventListener("change", () => {
      trigger.toggleAttribute("aria-invalid", false);
      this.#renderValue();
    });
    select.form?.addEventListener("reset", () => {
      // L'evento reset arriva PRIMA che il form ripristini i valori.
      setTimeout(() => this.#renderValue());
    });

    this.#watchProgrammaticChanges(select);

    // Se cambiano le <option> o disabled/required, ridisegniamo.
    this.#observer = new MutationObserver(() => this.#renderOptions());
    this.#observer.observe(select, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    this.#renderOptions();
  }

  /**
   * select.value = "en" da JavaScript NON emette eventi, quindi non lo
   * sapremmo. Ridefiniamo value e selectedIndex SOLO su questa istanza:
   * chiamano l'implementazione originale del browser e poi ridisegnano.
   * (È ciò che serve perché ngModel di Angular aggiorni il campo.)
   */
  #watchProgrammaticChanges(select: HTMLSelectElement): void {
    for (const prop of ["value", "selectedIndex"] as const) {
      const native = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, prop);
      if (!native?.get || !native.set) continue;
      Object.defineProperty(select, prop, {
        configurable: true,
        get: () => native.get!.call(select),
        set: (value: unknown) => {
          native.set!.call(select, value);
          this.#renderValue();
        },
      });
    }
  }

  // ---------------------------------------------------------------------
  // Disegno
  // ---------------------------------------------------------------------

  /** Le opzioni custom disegnate nella lista (una per ogni <option> visibile). */
  get #options(): HTMLElement[] {
    return Array.from(this.#list?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
  }

  /** Le <option> native corrispondenti, nello stesso ordine. */
  get #nativeOptions(): HTMLOptionElement[] {
    return Array.from(this.#select?.options ?? []).filter((option) => !option.hidden);
  }

  #renderOptions(): void {
    const select = this.#select;
    const list = this.#list;
    if (!select || !list) return;

    list.replaceChildren();
    let group: HTMLElement = list;
    let currentGroup: HTMLOptGroupElement | null = null;

    for (const native of this.#nativeOptions) {
      // <optgroup>: un gruppo con la sua etichetta.
      const parent = native.parentElement;
      if (parent instanceof HTMLOptGroupElement && parent !== currentGroup) {
        currentGroup = parent;
        group = document.createElement("div");
        group.setAttribute("role", "group");
        const title = document.createElement("div");
        title.className = "kaamos-select-group";
        title.id = `kaamos-select-group-${++nextId}`;
        title.textContent = labelOf(parent);
        group.setAttribute("aria-labelledby", title.id);
        group.append(title);
        list.append(group);
      } else if (!(parent instanceof HTMLOptGroupElement)) {
        currentGroup = null;
        group = list;
      }

      const option = document.createElement("div");
      option.id = `kaamos-select-option-${++nextId}`;
      option.className = "kaamos-select-option";
      option.setAttribute("role", "option");
      // textContent (non innerHTML): il testo delle opzioni non diventa mai HTML.
      const text = document.createElement("span");
      text.textContent = labelOf(native);
      option.append(text);
      option.insertAdjacentHTML("beforeend", CHECK);
      if (native.disabled || (parent instanceof HTMLOptGroupElement && parent.disabled)) {
        option.setAttribute("aria-disabled", "true");
      }
      group.append(option);
    }

    if (this.#trigger) this.#trigger.disabled = select.disabled;
    if (this.#trigger) this.#trigger.toggleAttribute("aria-required", select.required);
    this.#renderValue();
  }

  #renderValue(): void {
    const select = this.#select;
    if (!select || !this.#label) return;
    const selected = select.options[select.selectedIndex];
    // Un'opzione "segnaposto" (value="" e hidden) appare in grigio.
    this.#label.textContent = selected ? labelOf(selected) : "";
    this.#label.classList.toggle("text-mute", !selected || selected.value === "");

    const natives = this.#nativeOptions;
    this.#options.forEach((option, i) => {
      option.setAttribute("aria-selected", String(natives[i]?.selected ?? false));
    });
  }

  // ---------------------------------------------------------------------
  // Apertura, chiusura, posizione
  // ---------------------------------------------------------------------

  #toggle(): void {
    if (this.open) this.#close();
    else this.#open();
  }

  #open(): void {
    const list = this.#list;
    if (!list || this.#trigger?.disabled) return;
    list.showPopover();
  }

  #close(): void {
    if (this.open) this.#list?.hidePopover();
  }

  #onToggle = (event: Event): void => {
    const open = (event as ToggleEvent).newState === "open";
    this.#trigger?.setAttribute("aria-expanded", String(open));
    if (open) {
      // All'apertura l'opzione attiva è quella selezionata.
      const selected = this.#nativeOptions.findIndex((option) => option.selected);
      this.#setActive(Math.max(selected, 0), true);
      if (!supportsAnchor()) {
        this.#position();
        window.addEventListener("scroll", this.#position, true);
        window.addEventListener("resize", this.#position);
      }
    } else {
      this.#trigger?.removeAttribute("aria-activedescendant");
      window.removeEventListener("scroll", this.#position, true);
      window.removeEventListener("resize", this.#position);
    }
  };

  /**
   * Piano B per i browser senza anchor positioning: calcoliamo noi la
   * posizione dal rettangolo del campo (e la ricalcoliamo a scroll e resize).
   */
  #position = (): void => {
    const list = this.#list;
    const trigger = this.#trigger;
    if (!list || !trigger) return;
    const rect = trigger.getBoundingClientRect();
    const gap = 4;
    list.style.inset = "auto";
    list.style.margin = "0";
    list.style.minWidth = `${rect.width}px`;
    list.style.left = `${rect.left}px`;
    const below = window.innerHeight - rect.bottom;
    const height = list.offsetHeight;
    // Se sotto non c'è spazio e sopra sì, la apriamo sopra.
    const top =
      below < height + gap && rect.top > below ? rect.top - height - gap : rect.bottom + gap;
    list.style.top = `${top}px`;
  };

  // ---------------------------------------------------------------------
  // Scelta e opzione attiva
  // ---------------------------------------------------------------------

  #isEnabled(index: number): boolean {
    return this.#options[index]?.getAttribute("aria-disabled") !== "true";
  }

  #setActive(index: number, scroll: boolean): void {
    const options = this.#options;
    if (index < 0 || index >= options.length) return;
    this.#active = index;
    options.forEach((option, i) => option.toggleAttribute("data-active", i === index));
    const option = options[index];
    if (option) {
      this.#trigger?.setAttribute("aria-activedescendant", option.id);
      if (scroll) option.scrollIntoView?.({ block: "nearest" });
    }
  }

  /** Muove l'opzione attiva di `step`, saltando le disabilitate. */
  #move(from: number, step: number): void {
    const count = this.#options.length;
    for (let i = from + step; i >= 0 && i < count; i += step) {
      if (this.#isEnabled(i)) {
        this.#setActive(i, true);
        return;
      }
    }
  }

  #choose(index: number): void {
    const select = this.#select;
    const native = this.#nativeOptions[index];
    if (!select || !native || !this.#isEnabled(index)) return;
    const changed = !native.selected;
    native.selected = true;
    this.#renderValue();
    if (changed) {
      // Gli stessi eventi che emetterebbe il select nativo.
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  #onOptionClick = (event: MouseEvent): void => {
    // La lista sta (nel DOM) dentro l'eventuale <label> che avvolge il
    // componente. Senza preventDefault, il click "risalirebbe" alla label,
    // che lo girerebbe al campo... riaprendo subito la lista appena chiusa.
    event.preventDefault();
    const option = (event.target as Element).closest<HTMLElement>('[role="option"]');
    if (!option) return;
    const index = this.#options.indexOf(option);
    if (!this.#isEnabled(index)) return;
    this.#choose(index);
    this.#close();
    this.#trigger?.focus();
  };

  // ---------------------------------------------------------------------
  // Tastiera
  // ---------------------------------------------------------------------

  #onKeyDown = (event: KeyboardEvent): void => {
    const open = this.open;
    const last = this.#options.length - 1;

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // Spazio durante una ricerca digitando fa parte del testo cercato.
      if (event.key !== " " || this.#typeahead !== "") {
        this.#onTypeahead(event.key, open);
        event.preventDefault();
        return;
      }
    }

    if (!open) {
      switch (event.key) {
        case "ArrowDown":
        case "ArrowUp":
        case "Enter":
        case " ":
          this.#open();
          break;
        case "Home":
          this.#open();
          this.#move(-1, 1);
          break;
        case "End":
          this.#open();
          this.#move(last + 1, -1);
          break;
        default:
          return;
      }
      event.preventDefault();
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        this.#move(this.#active, 1);
        break;
      case "ArrowUp":
        if (event.altKey) {
          this.#choose(this.#active);
          this.#close();
          break;
        }
        this.#move(this.#active, -1);
        break;
      case "Home":
        this.#move(-1, 1);
        break;
      case "End":
        this.#move(last + 1, -1);
        break;
      case "PageDown":
        // Salta di 10 opzioni (o fino all'ultima).
        this.#move(Math.min(this.#active + 9, last - 1), 1);
        break;
      case "PageUp":
        this.#move(Math.max(this.#active - 9, 1), -1);
        break;
      case "Enter":
      case " ":
        this.#choose(this.#active);
        this.#close();
        break;
      case "Escape":
        this.#close();
        break;
      case "Tab":
        // Come da pattern ARIA: Tab sceglie l'opzione attiva e prosegue.
        this.#choose(this.#active);
        this.#close();
        return; // niente preventDefault: il focus deve andare avanti
      default:
        return;
    }
    event.preventDefault();
  };

  /**
   * Ricerca digitando, come i select nativi:
   *  - lettere diverse ("sv") cercano l'opzione che inizia con "sv";
   *  - la stessa lettera ripetuta ("sss") scorre le opzioni che iniziano con "s".
   */
  #onTypeahead(char: string, open: boolean): void {
    window.clearTimeout(this.#typeaheadTimer);
    this.#typeaheadTimer = window.setTimeout(() => (this.#typeahead = ""), TYPEAHEAD_RESET_MS);
    this.#typeahead += char.toLowerCase();

    const search = this.#typeahead;
    const sameLetter = [...search].every((c) => c === search[0]);
    const needle = sameLetter ? search[0]! : search;

    const labels = this.#nativeOptions.map((option) => labelOf(option).toLowerCase());
    const current = open ? this.#active : this.#nativeOptions.findIndex((o) => o.selected);
    // Con la stessa lettera ripetuta si parte dall'opzione DOPO quella attuale.
    const start = sameLetter || search.length === 1 ? current + 1 : Math.max(current, 0);
    const count = labels.length;

    for (let i = 0; i < count; i++) {
      const index = (start + i) % count;
      if (labels[index]?.startsWith(needle) && this.#isEnabled(index)) {
        if (open) this.#setActive(index, true);
        else this.#choose(index); // chiuso: cambia subito il valore, come il nativo
        return;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kaamos-select": KaamosSelect;
  }
}
