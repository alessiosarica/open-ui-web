/**
 * <kaamos-icon>
 *
 * A Lucide icon (https://lucide.dev) from `@kaamos-project/open-design-tokens/icons`.
 *
 * Register the icons you use once, then use them by name:
 *
 *   import { registerIcons } from "@kaamos/open-ui-web";
 *   import { mail, chevronDown } from "@kaamos-project/open-design-tokens/icons";
 *   registerIcons({ mail, chevronDown });
 *
 *   <kaamos-icon name="mail"></kaamos-icon>                 decorative
 *   <kaamos-icon name="mail" label="Unread"></kaamos-icon>  read by screen readers
 *   <kaamos-icon name="chevronDown" class="size-5 text-mute"></kaamos-icon>
 *
 * Or skip the registry and pass the icon itself: `el.icon = mail`.
 *
 * Why a registry instead of `name="mail"` working out of the box? The element
 * would have to import all 2,140 icons to look names up (~570 KB). With the
 * registry the app imports only the icons it uses, and the bundler drops the
 * rest (tree-shaking): a handful of icons is a few hundred bytes.
 *
 * Size: 16px by default (CSS in kaamos.css), change it with a class (`size-5`).
 * Colour: `currentColor`, so it follows the text colour (`text-mute`).
 */
import type { IconNode } from "@kaamos-project/open-design-tokens/icons";

export type { IconNode };

const SVG_NS = "http://www.w3.org/2000/svg";

/** Lucide's drawing attributes: 24×24 grid, 2px stroke, round caps and joins. */
const SVG_ATTRIBUTES: Record<string, string> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

const registry = new Map<string, IconNode>();

/**
 * Makes icons available to `<kaamos-icon name="...">`. The name is the key you
 * pass: `registerIcons({ chevronDown })` -> `name="chevronDown"`. Elements
 * already on the page with that name draw themselves.
 */
export function registerIcons(icons: Record<string, IconNode>): void {
  for (const [name, node] of Object.entries(icons)) registry.set(name, node);
  for (const el of document.querySelectorAll<KaamosIcon>("kaamos-icon[name]")) {
    if (el.getAttribute("name")! in icons) el.refresh();
  }
}

/** Builds the `<svg>` of an icon with the DOM API (no HTML parsing). */
export function createIconSvg(node: IconNode): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  for (const [k, v] of Object.entries(SVG_ATTRIBUTES)) svg.setAttribute(k, v);
  for (const [tag, attrs] of node) {
    const child = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) child.setAttribute(k, v);
    svg.append(child);
  }
  return svg;
}

const escapeAttribute = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/**
 * The same `<svg>` as markup, for the components' static templates. Decorative
 * (aria-hidden). The nodes come from the tokens package, and are escaped anyway.
 */
export function iconMarkup(node: IconNode, className = ""): string {
  const attrs = Object.entries(SVG_ATTRIBUTES)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join("");
  const children = node
    .map(([tag, a]) => {
      const list = Object.entries(a)
        .map(([k, v]) => ` ${k}="${escapeAttribute(v)}"`)
        .join("");
      return `<${tag}${list}/>`;
    })
    .join("");
  const cls = className ? ` class="${className}"` : "";
  return `<svg${cls}${attrs} aria-hidden="true">${children}</svg>`;
}

export class KaamosIcon extends HTMLElement {
  static observedAttributes: string[] = ["name", "label"];

  #icon: IconNode | null = null;
  #warned = false;

  connectedCallback(): void {
    this.refresh();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.refresh();
  }

  /** The icon to draw, bypassing the registry (wins over `name`). */
  get icon(): IconNode | null {
    return this.#icon;
  }
  set icon(node: IconNode | null) {
    this.#icon = node;
    if (this.isConnected) this.refresh();
  }

  /*
   * A missing icon is usually a forgotten registerIcons(). But elements in
   * the HTML are upgraded as soon as the library loads, often before the
   * app's own script registers its icons: so we wait for the page to finish
   * loading before warning.
   */
  #warnIfMissing(name: string): void {
    if (this.#warned) return;
    if (document.readyState !== "complete") {
      window.addEventListener("load", () => this.#warnIfMissing(name), { once: true });
      return;
    }
    if (this.#icon || this.getAttribute("name") !== name || registry.has(name)) return;
    this.#warned = true;
    console.warn(`<kaamos-icon>: "${name}" is not registered. Call registerIcons({ ${name} }).`);
  }

  /** Redraws the icon. Called by the element itself and by `registerIcons`. */
  refresh(): void {
    const name = this.getAttribute("name");
    const node = this.#icon ?? (name ? registry.get(name) : undefined);
    if (!node && name) this.#warnIfMissing(name);
    this.replaceChildren(...(node ? [createIconSvg(node)] : []));

    // With a label the icon means something: it's an image with a name.
    // Without one it's decorative and screen readers skip it.
    const label = this.getAttribute("label");
    if (label) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", label);
      this.removeAttribute("aria-hidden");
    } else {
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
      this.setAttribute("aria-hidden", "true");
    }
  }
}
