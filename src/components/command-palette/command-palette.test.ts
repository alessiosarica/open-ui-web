import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import "../../index.ts";

async function setup() {
  document.body.innerHTML = `
    <kaamos-command-palette shortcut="k">
      <button value="mail">Nuova email</button>
      <button value="cartella">Nuova cartella</button>
      <button value="impostazioni">Impostazioni</button>
    </kaamos-command-palette>`;
  await Promise.resolve();
  return document.querySelector("kaamos-command-palette")!;
}

function type(input: HTMLInputElement, text: string) {
  input.value = text;
  input.dispatchEvent(new Event("input"));
}

function press(input: HTMLInputElement, key: string) {
  input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

describe("kaamos-command-palette", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("sposta le righe in una listbox con ruoli ARIA", async () => {
    const el = await setup();
    expect(el.rows).toHaveLength(3);
    expect(el.rows.every((r) => r.getAttribute("role") === "option")).toBe(true);
    expect(el.rows[0]!.closest('[role="listbox"]')).not.toBeNull();
  });

  it("filtra le righe mentre scrivi", async () => {
    const el = await setup();
    const input = el.querySelector("input")!;
    type(input, "nuova");
    expect(el.rows.map((r) => r.hidden)).toEqual([false, false, true]);
    expect(el.rows[0]!.getAttribute("aria-selected")).toBe("true");
    expect(input.getAttribute("aria-activedescendant")).toBe(el.rows[0]!.id);
  });

  it("le frecce scorrono solo le righe visibili, Invio sceglie", async () => {
    const el = await setup();
    el.close = vi.fn();
    const input = el.querySelector("input")!;
    const onSelect = vi.fn();
    el.addEventListener("kaamos-select", (e) =>
      onSelect((e.detail.item as HTMLButtonElement).value),
    );
    type(input, "nuova");
    press(input, "ArrowDown");
    expect(el.rows[1]!.getAttribute("aria-selected")).toBe("true");
    press(input, "ArrowDown"); // gira in tondo, salta "Impostazioni" (nascosta)
    expect(el.rows[0]!.getAttribute("aria-selected")).toBe("true");
    press(input, "Enter");
    expect(onSelect).toHaveBeenCalledWith("mail");
    expect(el.close).toHaveBeenCalled();
  });
});
