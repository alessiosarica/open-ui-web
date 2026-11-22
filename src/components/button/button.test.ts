import { beforeEach, describe, expect, it } from "vite-plus/test";
import "../../index.ts";

describe("kaamos-button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("sposta i figli dentro un <button> nativo", async () => {
    document.body.innerHTML = `<kaamos-button>Download</kaamos-button>`;
    const el = document.querySelector("kaamos-button")!;
    // Alcuni parser collegano l'elemento prima dei figli: il MutationObserver
    // li sposta nel microtask successivo.
    await Promise.resolve();
    expect(el.button).toBeInstanceOf(HTMLButtonElement);
    expect(el.button!.textContent).toBe("Download");
    expect(el.children).toHaveLength(1);
  });

  it("usa primary come variante di default e la cambia", () => {
    document.body.innerHTML = `<kaamos-button>Ok</kaamos-button>`;
    const el = document.querySelector("kaamos-button")!;
    expect(el.button!.className).toContain("bg-primary");
    el.variant = "install";
    expect(el.button!.className).toContain("border-hairline-strong");
    expect(el.button!.className).not.toContain("bg-primary");
  });

  it("è type=button di default, così non invia i form per sbaglio", () => {
    document.body.innerHTML = `<form><kaamos-button>Ok</kaamos-button></form>`;
    expect(document.querySelector("kaamos-button")!.button!.type).toBe("button");
  });

  it("inoltra disabled al <button> interno", () => {
    document.body.innerHTML = `<kaamos-button disabled>Ok</kaamos-button>`;
    const el = document.querySelector("kaamos-button")!;
    expect(el.button!.disabled).toBe(true);
    el.disabled = false;
    expect(el.button!.disabled).toBe(false);
  });

  it("accoglie i figli aggiunti dopo (come fanno Angular e altri framework)", async () => {
    const el = document.createElement("kaamos-button");
    document.body.append(el);
    el.append("Tardi");
    await Promise.resolve(); // il MutationObserver gira come microtask
    expect(el.button!.textContent).toBe("Tardi");
  });
});

describe("kaamos-button con popover", () => {
  it("inoltra popovertarget al <button> interno", () => {
    document.body.innerHTML = `<kaamos-button popovertarget="menu">Apri</kaamos-button>`;
    expect(document.querySelector("kaamos-button")!.button!.getAttribute("popovertarget")).toBe(
      "menu",
    );
  });
});
