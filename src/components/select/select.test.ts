import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import "../../index.ts";

async function setup() {
  document.body.innerHTML = `
    <form>
      <label>
        Lingua
        <kaamos-select>
          <select name="lingua">
            <option value="it">Italiano</option>
            <option value="sv">Svenska</option>
            <option value="se" disabled>Sámegiella</option>
            <option value="su">Suomi</option>
          </select>
        </kaamos-select>
      </label>
    </form>`;
  await Promise.resolve();
  const el = document.querySelector("kaamos-select")!;
  const trigger = el.querySelector<HTMLButtonElement>('[role="combobox"]')!;
  // happy-dom non implementa del tutto la Popover API: simuliamo apertura e chiusura.
  const list = el.querySelector<HTMLElement>('[role="listbox"]')!;
  let open = false;
  list.matches = ((sel: string) =>
    sel === ":popover-open"
      ? open
      : Element.prototype.matches.call(list, sel)) as typeof list.matches;
  list.showPopover = () => {
    open = true;
    list.dispatchEvent(Object.assign(new Event("toggle"), { newState: "open" }));
  };
  list.hidePopover = () => {
    open = false;
    list.dispatchEvent(Object.assign(new Event("toggle"), { newState: "closed" }));
  };
  return { el, trigger, list, select: el.select! };
}

function key(target: Element, key: string) {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

describe("kaamos-select", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("disegna un combobox e una listbox dalle option native", async () => {
    const { trigger, list } = await setup();
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger.textContent).toContain("Italiano");
    expect(list.querySelectorAll('[role="option"]')).toHaveLength(4);
    expect(list.querySelectorAll('[aria-disabled="true"]')).toHaveLength(1);
  });

  it("il campo viene prima del select, così la label lo etichetta", async () => {
    const { el, trigger } = await setup();
    expect(el.firstElementChild).toBe(trigger);
  });

  it("scegliere un'opzione aggiorna il select nativo ed emette change", async () => {
    const { trigger, select, list } = await setup();
    const onChange = vi.fn();
    select.addEventListener("change", onChange);
    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    list.querySelectorAll<HTMLElement>('[role="option"]')[3]!.click();
    expect(select.value).toBe("su");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(new FormData(document.querySelector("form")!).get("lingua")).toBe("su");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("le frecce saltano le opzioni disabilitate, Invio sceglie", async () => {
    const { trigger, select } = await setup();
    key(trigger, "ArrowDown"); // apre su Italiano
    key(trigger, "ArrowDown"); // Svenska
    key(trigger, "ArrowDown"); // salta Sámegiella -> Suomi
    key(trigger, "Enter");
    expect(select.value).toBe("su");
  });

  it("ricerca digitando: la stessa lettera ripetuta scorre le opzioni", async () => {
    const { trigger, select } = await setup();
    key(trigger, "s"); // chiuso: cambia subito valore -> Svenska
    expect(select.value).toBe("sv");
    key(trigger, "s"); // "ss" = stessa lettera -> prossima con "s" (salta la disabilitata) -> Suomi
    expect(select.value).toBe("su");
  });

  it("si accorge di select.value cambiato da JavaScript", async () => {
    const { trigger, select } = await setup();
    select.value = "sv";
    expect(trigger.textContent).toContain("Svenska");
  });
});
