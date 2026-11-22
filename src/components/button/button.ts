/**
 * <kaamos-button>
 *
 * Varianti (dal DESIGN.md): primary | secondary | tertiary | install
 * Stato: attributo `disabled` (vale per tutte le varianti -> button-disabled)
 *
 * Esempio:
 *   <kaamos-button variant="primary">Download</kaamos-button>
 *   <kaamos-button variant="install" disabled>Install</kaamos-button>
 *
 * Light DOM: niente Shadow DOM, quindi le classi Tailwind globali funzionano
 * e il <button> interno partecipa ai <form> come un bottone normale.
 */

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "install";

/*
 * Le classi sono scritte INTERE e mai composte con stringhe ("bg-" + x):
 * Tailwind legge questo file come testo e genera solo le classi che trova.
 *
 * Nota: altezza e padding stanno nella variante e non nella base, perché
 * se mettessi "h-9" nella base e "h-8" in install, vincerebbe quella che
 * viene dopo nel CSS generato, non quella scritta dopo nell'attributo class.
 */
const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none " +
  "rounded-md font-sans text-button-md cursor-pointer " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark-mute " +
  "disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:text-ash disabled:border-transparent";

const VARIANTS: Record<ButtonVariant, string> = {
  // button-primary + button-primary-pressed (active = mentre lo premi)
  primary: "h-9 px-4 py-2 bg-primary text-on-primary active:bg-primary-pressed",
  // button-secondary: testo su sfondo trasparente
  secondary: "h-9 px-4 py-2 bg-transparent text-on-dark",
  // button-tertiary: superficie soffice
  tertiary: "h-9 px-4 py-2 bg-surface-elevated text-on-dark",
  // install-button: bordo hairline-strong, più compatto (~32px)
  install: "h-8 px-3.5 py-1.5 bg-transparent text-on-dark border border-hairline-strong",
};

const DEFAULT_VARIANT: ButtonVariant = "primary";

function isVariant(value: string | null): value is ButtonVariant {
  return value !== null && Object.hasOwn(VARIANTS, value);
}

/** Attributi che copiamo così come sono sul <button> interno. */
const FORWARDED = [
  "type",
  "name",
  "value",
  "form",
  "aria-label",
  "aria-pressed",
  // Per aprire popover, menu e dialog senza JavaScript. Funziona solo perché
  // siamo in light DOM: l'id indicato è nello stesso documento del <button>.
  "popovertarget",
  "popovertargetaction",
  "commandfor",
  "command",
] as const;

export class KaamosButton extends HTMLElement {
  static observedAttributes: string[] = ["variant", "disabled", ...FORWARDED];

  #button: HTMLButtonElement | null = null;
  #observer: MutationObserver | null = null;

  connectedCallback(): void {
    // connectedCallback può essere chiamato più volte (es. se sposti l'elemento):
    // creiamo il <button> interno una volta sola.
    if (!this.#button) {
      this.#button = document.createElement("button");
      this.#moveChildrenInside();
      this.append(this.#button);
    }

    // Senza <slot>, se un framework (Angular, Vue...) aggiunge figli DOPO
    // che l'elemento è nel DOM, li spostiamo noi dentro il <button>.
    this.#observer = new MutationObserver(() => this.#moveChildrenInside());
    this.#observer.observe(this, { childList: true });

    this.#render();
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = null;
  }

  attributeChangedCallback(): void {
    this.#render();
  }

  /** Il <button> nativo interno, per focus(), click() o test. */
  get button(): HTMLButtonElement | null {
    return this.#button;
  }

  get variant(): ButtonVariant {
    const value = this.getAttribute("variant");
    return isVariant(value) ? value : DEFAULT_VARIANT;
  }
  set variant(value: ButtonVariant) {
    this.setAttribute("variant", value);
  }

  get disabled(): boolean {
    return this.hasAttribute("disabled");
  }
  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  override focus(options?: FocusOptions): void {
    this.#button?.focus(options);
  }

  #moveChildrenInside(): void {
    const button = this.#button;
    if (!button) return;
    for (const node of Array.from(this.childNodes)) {
      if (node !== button) button.append(node);
    }
  }

  #render(): void {
    const button = this.#button;
    if (!button) return;

    button.className = `${BASE} ${VARIANTS[this.variant]}`;
    button.disabled = this.disabled;

    // Un <button> nativo dentro un <form> è "submit" di default. In un design
    // system è più sicuro il contrario: chi vuole inviare scrive type="submit".
    if (!this.hasAttribute("type")) button.type = "button";

    for (const name of FORWARDED) {
      const value = this.getAttribute(name);
      if (value === null) {
        if (name !== "type") button.removeAttribute(name);
      } else {
        button.setAttribute(name, value);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kaamos-button": KaamosButton;
  }
}
