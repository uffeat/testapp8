/* 
20250302 
src/rollo/components/shadow.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/components/shadow.js
*/
import { Sheet } from "@/rollo/sheet/sheet.js";
import { Sheets } from "@/rollo/sheet/tools/sheets.js";
import { component } from "@/rollo/component/component.js";
import { compose } from "@/rollo/tools/cls/compose.js";
import { registry } from "@/rollo/component/tools/registry.js";

import { attribute } from "@/rollo/component/factories/attribute.js";
import { classes } from "@/rollo/component/factories/classes.js";
import { connected } from "@/rollo/component/factories/connected.js";
import { content } from "@/rollo/component/factories/content.js";
import { css_vars } from "@/rollo/component/factories/css_vars.js";
import { data } from "@/rollo/component/factories/data.js";
import { detail } from "@/rollo/component/factories/detail.js";
import { handlers } from "@/rollo/component/factories/handlers.js";
import { name } from "@/rollo/component/factories/name.js";
import { parent } from "@/rollo/component/factories/parent.js";
import { props } from "@/rollo/component/factories/props.js";
import { style } from "@/rollo/component/factories/style.js";
import { text } from "@/rollo/component/factories/text.js";
import { value } from "@/rollo/component/factories/value.js";

class cls extends compose(
  HTMLElement,
  {},
  attribute,
  classes,
  connected,
  content,
  css_vars,
  data,
  detail,
  handlers,
  name,
  parent,
  props,
  style,
  text,
  value
) {
  static name = "RolloShadow";

  #owner;
  #sheet;
  #sheets;
  #slots;

  constructor() {
    super();
    this.id = "root";
  }

  get owner() {
    return this.#owner;
  }

  set owner(owner) {
    if (this.#owner) {
      throw new Error("Cannot change 'owner'.");
    }
    if (!owner.shadowRoot) {
      owner.attachShadow({ mode: "open" });
    }
    this.#sheet = Sheet(owner.shadowRoot);
    this.#sheets = Sheets(owner.shadowRoot);
    this.#slots = new Slots(this);
    owner.shadowRoot.append(this);
    this.#owner = owner;
  }

  get sheet() {
    return this.#sheet;
  }

  get sheets() {
    return this.#sheets;
  }

  get slots() {
    return this.#slots;
  }
}

registry.add(cls);

/* Returns instance of ShadowComponent.
NOTE
- ShadowComponent is a specialized web component. 
- Primary use case: As a read-only prop in an owner component.
- The idea is that, rather than operating on shadowRoot directly, 
  an owner component should operate on the shadow instance.  
- The ShadowComponent instance injects itself as a first child into 
  the owners shadowRoot. This works around the fact that ShadowRoot 
  cannot be extended and also provide a richer API compared to operating 
  directly on a shadowRoot */
export const Shadow = (owner, ...children) => {
  return component.rollo_shadow({ owner }, ...children);
};



/* Controller for slots. */
class Slots {
  #owner;

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns all slot elements in owner. */
  all() {
    return [...this.#owner.querySelectorAll("slot")];
  }

  /* Returns owner's slot element by name. 
  If falsy name, returns owner's nameless slot element.
  Returns null, if slot element not found. */
  get(name) {
    if (name) {
      return this.#owner.querySelector(`slot[name="${name}"]`);
    } else {
      return (
        this.#owner.querySelector("slot:not([name])") ||
        this.#owner.querySelector('slot[name=""]')
      );
    }
  }

  /* Tests, if owner has a slot element with a given name. If falsy name, tests, if shadow root has nameless a slot element. */
  has(name) {
    return !!this.get(name);
  }
}
