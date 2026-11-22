import { beforeEach, describe, expect, it } from "vite-plus/test";
import "../../index.ts";

describe("kaamos-search-bar", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("crea label, icona e input di tipo search", () => {
    document.body.innerHTML = `<kaamos-search-bar placeholder="Search..."></kaamos-search-bar>`;
    const el = document.querySelector("kaamos-search-bar")!;
    expect(el.querySelector("label")).not.toBeNull();
    expect(el.querySelector("svg")!.getAttribute("aria-hidden")).toBe("true");
    expect(el.input!.type).toBe("search");
    expect(el.input!.placeholder).toBe("Search...");
  });

  it("non interpreta gli attributi come HTML (niente XSS)", () => {
    document.body.innerHTML = `<kaamos-search-bar placeholder="&quot;&gt;&lt;img src=x onerror=alert(1)&gt;"></kaamos-search-bar>`;
    const el = document.querySelector("kaamos-search-bar")!;
    expect(el.querySelector("img")).toBeNull();
    expect(el.input!.placeholder).toBe('"><img src=x onerror=alert(1)>');
  });

  it("cambiare un attributo non ricrea l'input (il testo scritto resta)", () => {
    document.body.innerHTML = `<kaamos-search-bar></kaamos-search-bar>`;
    const el = document.querySelector("kaamos-search-bar")!;
    const input = el.input;
    el.value = "kubernetes";
    el.setAttribute("placeholder", "Cerca...");
    expect(el.input).toBe(input);
    expect(el.value).toBe("kubernetes");
  });

  it("partecipa al form", () => {
    document.body.innerHTML = `<form><kaamos-search-bar name="q" value="flutter"></kaamos-search-bar></form>`;
    expect(new FormData(document.querySelector("form")!).get("q")).toBe("flutter");
  });
});
