/* 
20250320
src/rolloui/components/layout/layout.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rolloui/components/layout/layout.js
import { layout } from "rolloui/components/layout/layout";
const { layout } = await import("rolloui/components/layout/layout");
*/

import { Reactive } from "rollo/reactive/value.js";
import { Sheet } from "rollo/sheet/sheet.js";
import { compose } from "rollo/tools/cls/compose.js";
import { component } from "rollo/component/component.js";
import { registry } from "rollo/component/tools/registry.js";

import { content } from "rollo/component/factories/content.js";
import { parent } from "rollo/component/factories/parent.js";
import { props } from "rollo/component/factories/props.js";
import { Shadow } from "rollo/components/shadow.js";

/* Import shadow assets */
import { reboot } from "@/libs/bootstrap/reboot.js";
import html from "rolloui/components/layout/assets/shadow.html?raw";

/* Implement component-specific light-DOM styles */
Sheet(document, {
  "rollo-layout": {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    //border: "3px solid green",
  },
});

class cls extends compose(HTMLElement, {}, content, parent, props) {
  static name = "RolloLayout";

  #shadow;
  #states;

  constructor() {
    super();
    /* Init shadow component */
    this.#shadow = Shadow(this);
    /* Set shadow assets */
    this.shadow.html.insert.beforeend(html);
    this.shadow.sheets.add(reboot);
    /* Init reactive states */
    this.#states = Object.freeze({
      closed: Reactive(false, { owner: this }, ({ current }) =>
        this.shadow.classList[current ? "add" : "remove"]("closed")
      ),
    });

    /* Click button in shadow -> toggle */
    this.shadow.on.click = (event) => {
      if (
        this.shadow.contains(event.target) &&
        event.target.closest("button")
      ) {
        this.toggle();
      }
    };

    /* Click main area in shadow -> close */
    this.shadow.on.click = (event) => {
      if (event.target.closest("main")) {
        this.close();
      }
    };

    /* Click external component not in side slot -> close */
    this.shadow.on.click = (event) => {
      if (
        !this.shadow.contains(event.target) &&
        !event.target.closest('[slot="side"]')
      ) {
        this.close();
      }
    };

    /*
    const side = this.shadow.querySelector("side-section");
    side.addEventListener("transitionstart", (event) => {
      if (event.target === event.currentTarget) {
        const width = document.documentElement.clientWidth;
        if (width >= 768) {
          //console.log("transition started"); ////
        } else {
        }
      }
    });
    side.addEventListener("transitionend", (event) => {
      if (event.target === event.currentTarget) {
        const width = document.documentElement.clientWidth;
        if (width >= 768) {
          //console.log("transition ended"); ////
        } else {
        }
      }
    });
    */
  }
  


  /* Returns shadow component. */
  get shadow() {
    return this.#shadow;
  }

  /* Returns object with reactive states. 
  NOTE
  - Useful for getting/setting state directly and for hooking into state effects. */
  get states() {
    return this.#states;
  }

  /* Appends children to specific slot. Chainable. */
  add(slot, ...children) {
    children.forEach((c) =>
      slot ? (c.slot = slot) : c.removeAttribute("slot")
    );
    this.append(...children);
    return this;
  }

  /* Removes slot-specific children. Chainable. */
  clear(slot) {
    const filter = slot ? (c) => c.slot === slot : (c) => !c.slot;
    const children = Array.from(this.children).filter(filter);
    children.forEach((c) => c.remove());
    return this;
  }

  close() {
    this.states.closed.current = true;
  }

  open() {
    this.states.closed.current = false;
  }

  toggle() {
    this.states.closed.current = !this.states.closed.current;
  }
}

registry.add(cls, {
  key: "rollo-layout",
  tag: "rollo-layout",
});

export const layout = component.rollo_layout();

/* EXAMPLES

await (async () => {
  const { layout } = await import("@/rolloui/components/layout/layout");
  app.append(layout);
})();

*/
