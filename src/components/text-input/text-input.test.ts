import { beforeEach, describe, expect, it } from "vite-plus/test";
import "../../index.ts";

describe("kaamos-text-input", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("crea un <input> nativo e inoltra gli attributi", () => {
    document.body.innerHTML = `<kaamos-text-input name="email" type="email" placeholder="tu@esempio.org" required></kaamos-text-input>`;
    const input = document.querySelector("kaamos-text-input")!.input!;
    expect(input.name).toBe("email");
    expect(input.type).toBe("email");
    expect(input.placeholder).toBe("tu@esempio.org");
    expect(input.required).toBe(true);
  });

  it("partecipa al <form> senza codice extra (light DOM)", () => {
    document.body.innerHTML = `<form><kaamos-text-input name="nome" value="Alessio"></kaamos-text-input></form>`;
    const data = new FormData(document.querySelector("form")!);
    expect(data.get("nome")).toBe("Alessio");
  });

  it("value legge e scrive il valore attuale", () => {
    document.body.innerHTML = `<kaamos-text-input></kaamos-text-input>`;
    const el = document.querySelector("kaamos-text-input")!;
    el.value = "ciao";
    expect(el.input!.value).toBe("ciao");
    expect(el.value).toBe("ciao");
  });
});
