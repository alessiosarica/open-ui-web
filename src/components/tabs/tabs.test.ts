import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import "../../index.ts";

async function setup(selected = "") {
  document.body.innerHTML = `
    <kaamos-tabs ${selected}>
      <div aria-label="Impostazioni">
        <button>Generale</button>
        <button>Account</button>
        <button>Privacy</button>
      </div>
      <section>Uno</section>
      <section>Due</section>
      <section>Tre</section>
    </kaamos-tabs>`;
  await Promise.resolve();
  return document.querySelector("kaamos-tabs")!;
}

describe("kaamos-tabs", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("collega tab e pannelli con i ruoli ARIA", async () => {
    const el = await setup();
    expect(el.firstElementChild!.getAttribute("role")).toBe("tablist");
    const [tab] = el.tabs;
    const [panel] = el.panels;
    expect(tab!.getAttribute("role")).toBe("tab");
    expect(tab!.getAttribute("aria-controls")).toBe(panel!.id);
    expect(panel!.getAttribute("aria-labelledby")).toBe(tab!.id);
  });

  it("mostra solo il pannello selezionato", async () => {
    const el = await setup('selected="1"');
    expect(el.panels.map((p) => p.hidden)).toEqual([true, false, true]);
    expect(el.tabs.map((t) => t.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
  });

  it("il click cambia tab ed emette kaamos-change", async () => {
    const el = await setup();
    const onChange = vi.fn();
    el.addEventListener("kaamos-change", (e) => onChange(e.detail.index));
    el.tabs[2]!.click();
    expect(el.selected).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("le frecce si muovono e girano in tondo", async () => {
    const el = await setup();
    el.tabs[0]!.focus();
    el.tabs[0]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(el.selected).toBe(2);
    expect(document.activeElement).toBe(el.tabs[2]);
    el.tabs[2]!.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    expect(el.selected).toBe(0);
  });

  it("solo la tab attiva è nell'ordine di Tab", async () => {
    const el = await setup();
    expect(el.tabs.map((t) => t.tabIndex)).toEqual([0, -1, -1]);
  });
});
