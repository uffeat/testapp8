import { reboot } from "@/libs/bootstrap/reboot";
import { Reactive } from "rollo/reactive/reactive_value";
import { Sheet } from "rollo/sheet/sheet";
import { compose } from "rollo/tools/cls/compose";
import { component } from "rollo/component/component";
import { registry } from "rollo/component/tools/registry";

import { content } from "rollo/component/factories/content";
import { parent } from "rollo/component/factories/parent";
import { props } from "rollo/component/factories/props";
import { shadow } from "rollo/components/shadow";

import html from "rolloui/components/layout/assets/shadow.html?raw";

class cls extends compose(HTMLElement, {}, content, parent, props) {
  static name = "LayoutComponent";

  #shadow;

  constructor() {
    super();
    this.id = "layout";
    this.#shadow = shadow(this);

    this.shadow.html.insert(html);
    this.shadow.sheets.add(reboot);

    /* Set up open/close state */
    (() => {
      const state = Reactive(false, {}, ({ current }) =>
        this.shadow.classList[current ? "add" : "remove"]("closed")
      );
      this.shadow.on.click = (event) => {
        if (event.target.closest("button")) {
          state.current = !state.current;
        } else if (
          !event.target.closest("nav") &&
          !event.target.closest('[slot="nav"]')
        ) {
          state.current = true;
        }
      };
    })();
  }

  get shadow() {
    return this.#shadow;
  }

  add(slot, ...children) {
    children.forEach((c) =>
      slot ? (c.slot = slot) : c.removeAttribute("slot")
    );
    this.append(...children);
    return this;
  }

  clear(slot) {
    const filter = slot ? (c) => c.slot === slot : (c) => !c.slot;
    const children = Array.from(this.children).filter(filter);
    children.forEach((c) => c.remove());
    return this;
  }
}

registry.add(cls);

export const layout = component.layout();

document.querySelector("html").dataset.bsTheme = "dark";
Sheet(document, {
  "layout-component": {
    height: "100vh",
    width: "100%",
    display: "flex",
    color: "var(--bs-body-color)",
  },
});
