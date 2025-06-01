/*
import { component } from "@/rollocomponent/component.js";
20250531
v.1.1
*/

import { Args } from "@/rollocomponent/tools/args.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";
import for_ from "@/rollocomponent/mixins/for_.js";
import novalidation from "@/rollocomponent/mixins/novalidation.js";
import text from "@/rollocomponent/mixins/text.js";

/* Utility for composing and registering non-autonomous web components. */
const registry = new (class {
  #_ = {
    registry: new Map(),
  };

  constructor(...mixins) {
    this.#_.mixins = mixins;
  }

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

    if ("textContent" in ref) {
      this.#_.mixins.push(text);
    }
    if (tag === "form") {
      this.#_.mixins.push(novalidation);
    }
    if (tag === "label") {
      this.#_.mixins.push(for_);
    }
    /* Compose */
    class cls extends mix(base, {}, ...this.#_.mixins) {
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
})(...mixins);

/* Returns instance of native web component. */
export const component = new Proxy(
  {},
  {
    get: (_, tag) => {
      const instance = new (registry.get(tag))();
      return (...args) => {
        /* Parse args */
        args = new Args(args);
        /* Add CSS classes */
        instance.classes.add(args.classes);
        /* Use updates */
        instance.update(args.updates);
        /* Append children */
        instance.append(...args.children);
        /* Set up child elements */
        args.children.forEach((child) => {
          if (child instanceof Node) {
            child.setup?.({ parent: instance });
          }
        });
        return instance.hooks(...args.hooks);
      };
    },
  }
);
