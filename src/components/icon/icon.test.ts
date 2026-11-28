import { mail, search } from "@kaamos-project/open-design-tokens/icons";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { iconMarkup, registerIcons, type KaamosIcon } from "../../index.ts";

const icon = () => document.querySelector<KaamosIcon>("kaamos-icon")!;

describe("kaamos-icon", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("draws a registered icon as an svg with Lucide's nodes", () => {
    registerIcons({ mail });
    document.body.innerHTML = `<kaamos-icon name="mail"></kaamos-icon>`;
    const svg = icon().querySelector("svg")!;
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg.getAttribute("stroke")).toBe("currentColor");
    expect(svg.children.length).toBe(mail.length);
    expect(svg.children[0]!.tagName.toLowerCase()).toBe(mail[0]![0]);
  });

  it("is decorative without a label, an image with one", () => {
    registerIcons({ mail });
    document.body.innerHTML = `<kaamos-icon name="mail"></kaamos-icon>`;
    expect(icon().getAttribute("aria-hidden")).toBe("true");
    expect(icon().hasAttribute("role")).toBe(false);

    icon().setAttribute("label", "Unread");
    expect(icon().getAttribute("role")).toBe("img");
    expect(icon().getAttribute("aria-label")).toBe("Unread");
    expect(icon().hasAttribute("aria-hidden")).toBe(false);
  });

  it("redraws when the name changes", () => {
    registerIcons({ mail, search });
    document.body.innerHTML = `<kaamos-icon name="mail"></kaamos-icon>`;
    icon().setAttribute("name", "search");
    expect(icon().querySelector("svg")!.children.length).toBe(search.length);
  });

  it("draws itself when the icon is registered later", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    document.body.innerHTML = `<kaamos-icon name="lateIcon"></kaamos-icon>`;
    expect(icon().querySelector("svg")).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
    registerIcons({ lateIcon: mail });
    expect(icon().querySelector("svg")).not.toBeNull();
    warn.mockRestore();
  });

  it("accepts the icon as a property, without the registry", () => {
    document.body.innerHTML = `<kaamos-icon></kaamos-icon>`;
    icon().icon = search;
    expect(icon().querySelector("svg")!.children.length).toBe(search.length);
  });
});

describe("iconMarkup", () => {
  it("is a decorative svg with the given classes", () => {
    const host = document.createElement("div");
    host.innerHTML = iconMarkup(search, "size-4 text-mute");
    const svg = host.querySelector("svg")!;
    expect(svg.getAttribute("class")).toBe("size-4 text-mute");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.children.length).toBe(search.length);
  });

  it("escapes attribute values", () => {
    const host = document.createElement("div");
    host.innerHTML = iconMarkup([["path", { d: '"><img src=x onerror=alert(1)>' }]]);
    expect(host.querySelector("img")).toBeNull();
  });
});
