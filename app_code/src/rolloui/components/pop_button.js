/* 
20250401
src/rolloui/components/pop_button.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rolloui/components/pop_button.js
import { PopButton } from "rolloui/components/pop_button";
const { PopButton } = await import("rolloui/components/pop_button");
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
  /* Inherit from Rollo's native button component; normally authored 
  on-demand in 'component', but here we need to trigger authoring explicitly. */
  author("button"),
  // Alternatively: component.button().constructor,
  {},
  __elements__
) {
  static name = "RolloPopButton";

  #options = {};
  #popover = null;



  __new__() {
    super.__new__?.();
    this.attribute[pascal_to_kebab(this.constructor.name)] = true;
    this.type = "button";
    this.classes.add("btn");
    /* Build __elements__ */
    this.__elements__.container = component.div();
    /* Reflect 'show' and 'shown' as component attr and fire 'popover' event 
    with show-related detail. Enables wide-ranging customization. */
    this.on["show.bs.popover"] = (event) => {
      this.attribute.show = true;
      this.send("popover", { detail: "show" });
    };
    this.on["shown.bs.popover"] = (event) => {
      this.attribute.shown = true;
      this.send("popover", { detail: "shown" });
    };
    this.on["hide.bs.popover"] = (event) => {
      this.attribute.show = null;
      this.send("popover", { detail: "hide" });
    };
    this.on["hidden.bs.popover"] = (event) => {
      this.attribute.shown = null;
      this.send("popover", { detail: "hidden" });
    };

    /* Inject content container into popover body. */
    this.on["inserted.bs.popover"] = (event) => {
      /* HACK Mitigates Bootstrap's 
      failure to correctly set content as an element. */
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

    /* Create/dispose on each show-cycle */
    const on_click = this.handlers.add(
      "click",
      (event) => {
        /* Create popover */
        this.#popover = new Popover(this, {
          /* Not Bootstrap recommendation, but provides clean encapsulation */
          container: this,
          /* HACK If the 'content' option is '', the popover will not show */
          content: " ",
          ...this.#options,
        });
        /* Show popover */
        this.toggle();
      },
      { once: true }
    );
    this.on["hidden.bs.popover"] = (event) => {
      this.#dispose();
      /* Prepare for re-init */
      this.handlers.add("click", on_click, { once: true });
    };
  }

  disconnectedCallback() {
    this.#dispose();
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
    return this.#options.delay || null;
  }
  /* Sets delay. 
  NOTE
  - null resets to default. 
  - Relies on Bootstrap to throw error, if invalid value.
  - Recommendation: Use null or a number. */
  set delay(delay) {
    if (delay === null) {
      delete this.#options.delay;
    } else {
      this.#options.delay = delay;
    }
  }

  /* Returns offset. */
  get offset() {
    return this.#options.offset || null;
  }
  /* Sets offset. 
  NOTE
  - null resets to default. 
  - Relies on Bootstrap to throw error, if invalid value.
  - Recommendation: Use null or an array with two numbers.*/
  set offset(offset) {
    if (offset === null) {
      delete this.#options.offset;
    } else {
      /* Convert to string to minimize mutation risk
      (although not really critical) */
      if (Array.isArray(offset)) {
        offset = offset.join(",");
      }
      this.#options.offset = offset;
    }
  }

  /* Returns raw options object. */
  get options() {
    return this.#options;
  }
  /* Sets raw options object.
  NOTE
  - Provides a more low-level alternative to setting options via component 
    props.
  - Access to all Boostrap options.
  - Risk of unpredictable results, if overlap with props-based options or 
    component defaults.
  - Intentionally fully exposed to mutation effects, so use with care. */
  set options(options) {
    this.#options = options;
  }

  /* Returns placement. */
  get placement() {
    return this.#options.placement || null;
  }
  /* Sets placement. 
  NOTE
  - null resets to default. 
  - Relies on Bootstrap to throw error, if invalid value.
  - Recommendation: Use null or a string.*/
  set placement(placement) {
    if (placement === null) {
      delete this.#options.placement;
    } else {
      this.#options.placement = placement;
    }
  }

  /* Hides popover. Chainable.
  NOTE
  - Can be used for setting up custom behaviour. */
  hide() {
    this.#popover?.hide();
    return this;
  }

  /* Shows popover. Chainable.
  NOTE
  - Can be used for setting up custom behaviour. */
  show() {
    this.#popover?.show();
    return this;
  }

  /* Toggles popover. Chainable.
  NOTE
  - Can be used for setting up custom behaviour. */
  toggle() {
    this.#popover?.toggle();
    return this;
  }

  #dispose() {
    this.#popover?.dispose();
    this.#popover = null;
  }
}

registry.add(cls, { native: "button" });

/* Returns button with popover feature. */
export const PopButton = (...args) => {
  const self = component.rollo_pop_button(...args);
  return self;
};
