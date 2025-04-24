/* 
20250303
src/rolloui/components/nav.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rolloui/components/nav.js
import { Nav } from "rolloui/components/nav";
const { Nav } = await import("rolloui/components/nav");
*/

import { component } from "@/rollo/component/component.js";
import { compose } from "@/rollo/tools/cls/compose.js";
import { Reactive } from "@/rollo/reactive/value.js";
import { registry } from "@/rollo/component/tools/registry.js";

import { attribute } from "@/rollo/component/factories/attribute.js";
import { content } from "@/rollo/component/factories/content.js";
import { css_vars } from "@/rollo/component/factories/css_vars.js";
import { data } from "@/rollo/component/factories/data.js";
import { detail } from "@/rollo/component/factories/detail.js";
import { handlers } from "@/rollo/component/factories/handlers.js";
import { parent } from "@/rollo/component/factories/parent.js";
import { props } from "@/rollo/component/factories/props.js";
import { send } from "@/rollo/component/factories/send.js";

class cls extends compose(
  HTMLElement,
  {},
  attribute,
  content,
  css_vars,
  data,
  detail,
  handlers,
  parent,
  props,
  send
) {
  static name = "RolloNav";
  #states;

  __new__() {
    super.__new__?.();
    /* Add identification attribute */
    this.attribute.rolloNav = true;
    /* Add Bootstrap style */
    this.classList.add("nav");
    /* Init reactive states */
    this.#states = Object.freeze({
      active: Reactive(null, { owner: this }, ({ current, previous }) => {
        if (previous) {
          previous.update({
            ".active": null,
            ariaCurrent: null,
            ariaSelected: "false",
          });
        }
        if (current) {
          current.update({
            ".active": true,
            ariaCurrent: "page",
            ariaSelected: "true",
          });
        }
      }),
    });
    /* Control active state from click handler */
    this.on.click = (event) => {
      const link = event.target.closest("a");
      if (link) {
        if (!link.href) {
          /* Only prevent default, if no href */
          event.preventDefault();
        }
        /* Change state - even for external links */
        this.states.active.update(link);
      }
    };
  }

  /* Returns object with reactive states. 
  NOTE
  - Useful for getting/setting state directly and for hooking into state effects. */
  get states() {
    return this.#states;
  }

  /* Updates 'active' state by selector. Chainable */
  active(selector) {
    const link = this.querySelector(selector);

    if (link) {
      this.#states.active.update(link);
    } else {
      this.#states.active.update(null);
    }
    return this;
  }
}

registry.add(cls, {
  native: "nav",
});

export const Nav = (...args) => {
  const element = component.rollo_nav(...args);
  return element;
};

/* EXAMPLES
await (async () => {
  const { Nav } = await import("rolloui/components/nav");

  component.div(
    { parent: app },
    component.h3({}, "Colors"),
    Nav(
      "nav-pills.d-flex.justify-content-end.column-gap-1.p-1",
      {},
      component.a("nav-link", { detail: "pink" }, "Pink"),
      component.a("nav-link", { detail: "dodgerblue" }, "Dodger"),
      component.a("nav-link", { detail: "cornsilk" }, "Corn"),
      component.a(
        "nav-link",
        {
          target: "_blank",
          href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a",
        },
        "About"
      ),
      (self) => {
        self.active('a[detail="dodgerblue"]')
        self.states.active.effects.add(({current}) => console.log(`current:`, current))
      }
    )
  );
})();

*/
