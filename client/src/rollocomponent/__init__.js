/*
import { component } from "@/rollocomponent/__init__.js";
const { component } = await use("@/rollocomponent/");
20250602
v.1.2
*/

import { author } from "@/rollocomponent/tools/author.js";
import { compose } from "@/rollocomponent/tools/compose.js";
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
      console.info("Registered component with tag:", tag);
    }
    return cls;
  }
})();

/* Returns instance of native web component. */
export const component = new Proxy(
  {},
  {
    get: (target, tag) => {
      const cls = registry.get(tag);

      return factory(cls);
    },
  }
);

export const Component = author("Component", compose());
