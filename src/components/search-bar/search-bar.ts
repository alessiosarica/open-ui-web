/**
 * <kaamos-search-bar>
 *
 * Dal DESIGN.md (store-search-bar):
 *   sfondo surface-elevated, testo on-dark, tipografia body-md,
 *   padding 10px 16px, altezza ~44px, rounded md, lente a sinistra.
 *
 * Esempio:
 *   <kaamos-search-bar name="q" placeholder="Search..." aria-label="Cerca estensioni"></kaamos-search-bar>
 *
 * Il contenitore è una <label>: cliccando sulla lente o sul padding il focus
 * va all'input senza JavaScript. Per questo NON va messa dentro un'altra
 * <label> (le label annidate non sono valide): usa aria-label.
 */

/*
 * Lo stile del bordo e dello sfondo sta sul contenitore, non sull'input.
 * focus-within: il contenitore reagisce quando un suo figlio (l'input) ha il focus.
 * Il DESIGN.md non dà un bordo alla search bar: usiamo un bordo trasparente
 * che al focus diventa hairline-strong, come nel text-input.
 */
const CONTAINER_CLASSES =
  "flex items-center gap-3 h-11 px-4 py-2.5 rounded-md cursor-text " +
  "bg-surface-elevated text-on-dark border border-transparent " +
  "focus-within:border-hairline-strong";

/* L'input "sparisce": niente sfondo, bordo o outline. Prende lo spazio rimasto. */
const INPUT_CLASSES =
  "flex-1 min-w-0 h-full p-0 bg-transparent border-0 outline-none " +
  "font-sans text-body-md text-on-dark placeholder:text-mute " +
  "disabled:text-ash disabled:cursor-not-allowed";

/*
 * Template STATICO: contiene solo markup e classi scritte da noi, nessun valore
 * che arriva dall'esterno. È questo che rende innerHTML sicuro qui.
 * Gli attributi dell'utente (placeholder, name...) li impostiamo dopo con
 * setAttribute, che non interpreta mai il testo come HTML.
 */
const TEMPLATE = `
<label class="${CONTAINER_CLASSES}">
  <svg class="size-4 shrink-0 text-mute" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
    <circle cx="7" cy="7" r="5" />
    <path d="M14 14l-3.5-3.5" />
  </svg>
  <input class="${INPUT_CLASSES}" type="search" />
</label>`;

const FORWARDED = [
  "name",
  "placeholder",
  "autocomplete",
  "minlength",
  "maxlength",
  "aria-label",
  "aria-describedby",
] as const;

const BOOLEAN = ["disabled", "required", "readonly"] as const;

export class KaamosSearchBar extends HTMLElement {
  static observedAttributes: string[] = [...FORWARDED, ...BOOLEAN, "value"];

  #input: HTMLInputElement | null = null;

  connectedCallback(): void {
    // innerHTML UNA volta sola: se lo rieseguissimo a ogni cambio di attributo
    // ricreeremmo l'<input>, perdendo il testo scritto e il focus.
    if (!this.#input) {
      this.innerHTML = TEMPLATE;
      this.#input = this.querySelector("input");
      this.#input?.addEventListener("blur", this.#forwardBlur);
      if (this.#input) this.#input.value = this.getAttribute("value") ?? "";
    }
    this.#render();
  }

  attributeChangedCallback(name: string): void {
    if (name === "value" && this.#input) {
      this.#input.defaultValue = this.getAttribute("value") ?? "";
    }
    this.#render();
  }

  get input(): HTMLInputElement | null {
    return this.#input;
  }

  get value(): string {
    return this.#input?.value ?? this.getAttribute("value") ?? "";
  }
  set value(value: string) {
    if (this.#input) this.#input.value = value;
    else this.setAttribute("value", value);
  }

  /*
   * disabled, required e readonly anche come PROPRIETÀ JavaScript, non solo
   * come attributi: Angular (form.disable()) e molte librerie fanno
   * el.disabled = true. La proprietà "riflette" sull'attributo, così c'è una
   * sola fonte di verità e anche il CSS [disabled] resta coerente.
   */
  get disabled(): boolean {
    return this.hasAttribute("disabled");
  }
  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get required(): boolean {
    return this.hasAttribute("required");
  }
  set required(value: boolean) {
    this.toggleAttribute("required", value);
  }

  get readOnly(): boolean {
    return this.hasAttribute("readonly");
  }
  set readOnly(value: boolean) {
    this.toggleAttribute("readonly", value);
  }

  override focus(options?: FocusOptions): void {
    this.#input?.focus(options);
  }

  /**
   * "blur" non risale dal campo interno al nostro tag (bubbles: false),
   * quindi chi ascolta blur sul tag (es. Angular per lo stato "touched")
   * non lo sentirebbe mai. Lo riemettiamo noi sul tag, uguale al nativo.
   */
  #forwardBlur = (): void => {
    this.dispatchEvent(new FocusEvent("blur"));
  };

  #render(): void {
    const input = this.#input;
    if (!input) return;

    for (const name of FORWARDED) {
      const value = this.getAttribute(name);
      if (value === null) input.removeAttribute(name);
      else input.setAttribute(name, value);
    }
    for (const name of BOOLEAN) {
      input.toggleAttribute(name, this.hasAttribute(name));
    }
    // Stato disabilitato anche sul contenitore (cursore).
    input.parentElement?.classList.toggle("cursor-not-allowed", this.hasAttribute("disabled"));
    input.parentElement?.classList.toggle("cursor-text", !this.hasAttribute("disabled"));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kaamos-search-bar": KaamosSearchBar;
  }
}
