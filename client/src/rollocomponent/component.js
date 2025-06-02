/*
import { component } from "@/rollocomponent/component.js";
20250602
v.2.0
*/

import { factory } from "@/rollocomponent/tools/factory.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { MIXINS } from "@/rollocomponent/tools/mixins.js";

/* Utility for composing and registering non-autonomous web components. */
const registry = new (class {
  #_ = {
    registry: new Map(),
  };

  /* Returns composed and registered non-autonomous web component class. */
  get(tag) {
    if (this.#_.registry.has(tag)) {
      return this.#_.registry.get(tag);
    }
    const ref = document.createElement(tag);
    const base = ref.constructor;
    if (base === HTMLUnknownElement) {
      throw new Error(`'${tag}' is not native.`);
    }

    const mixins = MIXINS.create();

    if ("textContent" in ref) {
      mixins.push(MIXINS.text);
    }
    if (tag === "form") {
      mixins.push(MIXINS.novalidation);
    }
    if (tag === "label") {
      mixins.push(MIXINS.for_);
    }
    /* Compose */
    class cls extends mix(base, {}, ...mixins) {
      constructor() {
        super();
        this.setAttribute("web-component", "");
      }
    }
    /* Register */
    this.#_.registry.set(tag, cls);
    customElements.define(`x-${tag}`, cls, {
      extends: tag,
    });
    if (import.meta.env.DEV) {
      console.info(`Registered native '${tag}' component.`);
    }
    return cls;
  }
})();

/* Returns instance of basic non-autonomous web component. */
export const component = new Proxy(
  {},
  {
    get: (target, tag) => {
      return factory(registry.get(tag));
    },
  }
);
