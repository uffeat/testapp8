/* 
20250331
src/rolloui/components/form/file_loader.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rolloui/components/form/file_loader.js
import { FileLoader } from "rolloui/components/form/file_loader";
const { FileLoader } = await import("rolloui/components/form/file_loader");
*/

import "@/bootstrap.scss";
import { Popover } from "bootstrap";

import { compose } from "@/rollo/tools/cls/compose.js";
import { pascal_to_kebab } from "@/rollo/tools/text/case.js";

import { component } from "@/rollo/component/component.js";
import { registry } from "@/rollo/component/tools/registry.js";
import { author } from "@/rollo/component/tools/author.js";

import { __elements__ } from "@/rolloui/components/factories/__elements__.js";

class cls extends compose(
  /* Inherit from Rollo's native button component; this is normally authored 
  on-demand in 'component', but here we need to trigger that authoring explicitly. */
  author("button"),
  // Alternatively: component.button().constructor,
  {},
  __elements__
) {
  static name = "RolloPop";

  #options = {};
  #popover = null;

  constructor() {
    super();
    this.attribute.webComponent = pascal_to_kebab(this.constructor.name);
    this.type = "button";
    this.classes.add("btn");
    /* Build __elements__ */
    this.__elements__.container = component.div();
  }

  __new__() {
    super.__new__?.();
    /* Reflect show as component attr and fire popover event, when show state 
    changes. */
    this.on["show.bs.popover"] = (event) => {
      this.attribute.show = true;
      this.send("popover", { detail: true });
    };
    this.on["hide.bs.popover"] = (event) => {
      this.attribute.show = null;
      this.send("popover", { detail: false });
    };

    /* HACK Injects content container into popover body. Mitigates Bootstrap's 
    failure to correctly set content as an element. */
    this.on["inserted.bs.popover"] = (event) => {
      const body = this.querySelector(".popover-body");
      /* Clearing innerHTML seems to be redundant in practice, but the 
      idea is the ensure that the single-space content does not show. */
      body.innerHTML = "";
      body.append(this.__elements__.container);
    };
    /* Hide on blur and escape */
    const hide = (event) => {
      if (event.type !== "keydown" || event.code === "Escape") {
        this.hide();
      }
    };
    this.on.blur = hide;
    this.on.keydown = hide;
  }

  connectedCallback() {
    this.#factory();
  }

  disconnectedCallback() {
    this.#popover?.dispose();
    this.#popover = null;
  }

  /* Returns content. */
  get content() {
    return this.__elements__.content || null;
  }
  /* Sets content. */
  set content(content) {
    this.attribute.content = content;
    /* Store content in __elements__ for retrieval from getter */
    this.__elements__.content = content;
    const container = this.__elements__.container;
    container.clear();
    if (content) {
      container.append(content);
    }
  }

  /* Returns delay. */
  get delay() {
    return this.#options.delay;
  }
  /* Sets delay. */
  set delay(delay) {
    if (delay === null) {
      delay = 0;
    } else {
      if (typeof delay !== "number") {
        console.error("delay:", delay);
        throw new Error("Invalid delay. Expected number or null.");
      }
    }
    this.#options.delay = delay;
    this.#factory();
  }

  /* Returns options.
  NOTE
  - Primaily for (rare) inspection. */
  get options() {
    return Object.freeze({ ...this.#options });
  }

  /* Returns offset. */
  get offset() {
    return this.#options.offset;
  }
  /* Sets offset. */
  set offset(offset) {
    if (offset === null) {
      offset = [0, 0];
    } else {
      if (!Array.isArray(offset)) {
        console.error("offset:", offset);
        throw new Error("Invalid offset. Expected array or null.");
      }
      offset = [...offset];
    }
    this.#options.offset = offset;
    this.#factory();
  }

  /* Hides popover. Chainable */
  hide() {
    this.#popover?.hide();
    return this;
  }

  /* Shows popover. Chainable */
  show() {
    this.#popover?.show();
    return this;
  }

  /* Toggles popover. Chainable */
  toggle() {
    this.#popover?.toggle();
    return this;
  }

  /* Sets popover with current options. 
  NOTE
  - Bootstrap generally cannot update options dynamically, therefore
    call #factory, whenever options change. */
  #factory() {
    this.#popover?.dispose();
    this.#popover = new Popover(this, {
      container: this,
      /* HACK If the 'content' option is '', the popover will not show */
      content: " ",
      ...this.#options,
    });
  }
}

registry.add(cls, { native: "button" });

/* Returns button with popover feature. */
export const Pop = (...args) => {
  const self = component.rollo_pop(...args);
  return self;
};
