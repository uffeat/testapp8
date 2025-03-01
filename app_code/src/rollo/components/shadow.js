import { Sheet } from "@/rollo/sheet/sheet";
import { Sheets } from "@/rollo/sheet/tools/sheets";
import { component } from "@/rollo/component/component";
import { compose } from "@/rollo/tools/cls/compose";
import { registry } from "@/rollo/component/tools/registry";

import { attribute } from "@/rollo/component/factories/attribute";
import { connected } from "@/rollo/component/factories/connected";
import { content } from "@/rollo/component/factories/content";
import { css_vars } from "@/rollo/component/factories/css_vars";
import { data } from "@/rollo/component/factories/data";
import { detail } from "@/rollo/component/factories/detail";
import { elements } from "rollo/component/factories/elements";
import { handlers } from "rollo/component/factories/handlers";
import { name } from "@/rollo/component/factories/name";
import { parent } from "@/rollo/component/factories/parent";
import { props } from "@/rollo/component/factories/props";
import { style } from "@/rollo/component/factories/style";
import { text } from "@/rollo/component/factories/text";
import { value } from "@/rollo/component/factories/value";

class cls extends compose(
  HTMLElement,
  {},
  attribute,
  connected,
  content,
  css_vars,
  data,
  detail,
  elements,
  handlers,
  name,
  parent,
  props,
  style,
  text,
  value
) {
  static name = "ShadowComponent";

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

export const Shadow = (owner, ...children) => {
  return component.shadow({ owner }, ...children);
};

export const shadow = (owner, ...children) => {
  const self = component.shadow({ owner }, ...children);
  return new Proxy(self, {
    get(target, key) {
      if (key in self) {
        const value = Reflect.get(self, key);
        /* Bind any function value to self */
        return typeof value === "function" ? value.bind(self) : value;
      }
      return self.elements[key];
    },
  });
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
