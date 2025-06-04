/*
import { component } from "@/rollocomponent/component.js";
20250602
v.2.0
*/

import { factory } from "@/rollocomponent/tools/factory.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";

/* Utility for composing and registering non-autonomous web components. */
const registry = new (class {
  #_ = {
    mixins: Object.freeze([
      mixins.append,
      mixins.attrs,
      mixins.classes,
      mixins.clear,
      mixins.components,
      mixins.connect,
      mixins.effect,
      mixins.find,
      mixins.handlers,
      mixins.hooks,
      mixins.host,
      mixins.insert,
      mixins.key,
      mixins.parent,
      mixins.props,
      mixins.send,
      mixins.setup,
      mixins.state,
      mixins.style,
      mixins.tab,
      mixins.text,
      mixins.vars,
    ]),
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

    const _mixins = [...this.#_.mixins];

    if ("textContent" in ref) {
      _mixins.push(mixins.text);
    }
    if (tag === "form") {
      _mixins.push(mixins.novalidation);
    }
    if (tag === "label") {
      _mixins.push(mixins.for_);
    }
    /* Compose */
    class cls extends mix(base, {}, ..._mixins) {
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
