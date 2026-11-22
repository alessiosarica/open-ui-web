/**
 * <kaamos-text-input>
 *
 * Dal DESIGN.md: text-input + text-input-focused.
 * Al focus il bordo passa da hairline a hairline-strong: "una leggera
 * schiarita, non un anello colorato".
 *
 * Esempio:
 *   <label>
 *     Email
 *     <kaamos-text-input name="email" type="email" placeholder="tu@esempio.org"></kaamos-text-input>
 *   </label>
 *
 * Grazie al light DOM l'<input> interno è un discendente vero della <label>
 * e del <form>: label cliccabile, invio del form e validazione nativa
 * funzionano senza codice extra.
 */

const INPUT_CLASSES =
  "block w-full h-9 px-3 py-2 rounded-md font-sans text-body-md " +
  "bg-surface-elevated text-on-dark border border-hairline " +
  "placeholder:text-mute outline-none focus:border-hairline-strong " +
  "disabled:text-ash disabled:cursor-not-allowed";

/** Attributi copiati sull'<input> interno. */
const FORWARDED = [
  "type",
  "name",
  "placeholder",
  "autocomplete",
  "inputmode",
  "minlength",
  "maxlength",
  "pattern",
  "aria-label",
  "aria-describedby",
] as const;

/** Attributi booleani: presenti o assenti. */
const BOOLEAN = ["disabled", "required", "readonly"] as const;

export class KaamosTextInput extends HTMLElement {
  static observedAttributes: string[] = [...FORWARDED, ...BOOLEAN, "value"];

  #input: HTMLInputElement | null = null;

  connectedCallback(): void {
    if (!this.#input) {
      this.#input = document.createElement("input");
      // L'attributo value è il valore *iniziale*, come per l'<input> nativo.
      this.#input.value = this.getAttribute("value") ?? "";
      this.append(this.#input);
    }
    this.#render();
  }

  attributeChangedCallback(name: string): void {
    if (name === "value" && this.#input) {
      this.#input.defaultValue = this.getAttribute("value") ?? "";
    }
    this.#render();
  }

  /** L'<input> nativo interno. */
  get input(): HTMLInputElement | null {
    return this.#input;
  }

  /** Il valore *attuale* (quello che l'utente ha scritto). */
  get value(): string {
    return this.#input?.value ?? this.getAttribute("value") ?? "";
  }
  set value(value: string) {
    if (this.#input) this.#input.value = value;
    else this.setAttribute("value", value);
  }

  override focus(options?: FocusOptions): void {
    this.#input?.focus(options);
  }

  #render(): void {
    const input = this.#input;
    if (!input) return;

    input.className = INPUT_CLASSES;
    if (!this.hasAttribute("type")) input.type = "text";

    for (const name of FORWARDED) {
      const value = this.getAttribute(name);
      if (value === null) {
        if (name !== "type") input.removeAttribute(name);
      } else {
        input.setAttribute(name, value);
      }
    }
    for (const name of BOOLEAN) {
      input.toggleAttribute(name, this.hasAttribute(name));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kaamos-text-input": KaamosTextInput;
  }
}
