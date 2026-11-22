import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import "../../index.ts";

async function setup() {
  document.body.innerHTML = `
    <kaamos-menu id="m" aria-label="Azioni">
      <button>Rinomina</button>
      <button disabled>Sposta</button>
      <hr />
      <button>Elimina</button>
    </kaamos-menu>`;
  // Le voci possono essere collegate dopo il menu: il MutationObserver le
  // decora nel microtask successivo.
  await Promise.resolve();
  return document.querySelector("kaamos-menu")!;
}

describe("kaamos-menu", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("diventa un popover con ruoli ARIA da menu", async () => {
    const menu = await setup();
    expect(menu.getAttribute("popover")).toBe("auto");
    expect(menu.getAttribute("role")).toBe("menu");
    const items = menu.querySelectorAll("button");
    expect([...items].every((b) => b.getAttribute("role") === "menuitem")).toBe(true);
    expect(menu.querySelector("hr")!.getAttribute("role")).toBe("separator");
  });

  it("le voci escono dall'ordine di Tab (roving tabindex)", async () => {
    const menu = await setup();
    expect([...menu.querySelectorAll("button")].every((b) => b.tabIndex === -1)).toBe(true);
  });

  it("le frecce saltano le voci disabilitate e girano in tondo", async () => {
    const menu = await setup();
    const [rinomina, , elimina] = menu.querySelectorAll("button");
    rinomina!.focus();
    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(document.activeElement).toBe(elimina);
    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(document.activeElement).toBe(rinomina);
    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(document.activeElement).toBe(elimina);
  });

  it("al click emette kaamos-select con la voce scelta", async () => {
    const menu = await setup();
    menu.hidePopover = vi.fn();
    const onSelect = vi.fn();
    menu.addEventListener("kaamos-select", (e) => onSelect(e.detail.item.textContent));
    menu.querySelectorAll("button")[2]!.click();
    expect(onSelect).toHaveBeenCalledWith("Elimina");
    expect(menu.hidePopover).toHaveBeenCalled();
  });
});
