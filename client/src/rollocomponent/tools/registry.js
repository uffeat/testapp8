/*
import { registry } from "@/rollocomponent/tools/registry.js";
20250605
v.1.0
*/

export const registry = new (class {
  #_ = {
    registry: new Map(),
  };

  /* Registers web component. */
  add(cls, key, ext) {
    

    if (ext) {
      customElements.define(key, cls, {
        extends: ext,
      });
      if (import.meta.env.DEV) {
        console.info(`Defined '${key}' component extended from '${ext}'.`);
      }
    } else {
      customElements.define(key, cls);
      if (import.meta.env.DEV) {
        console.info(`Defined '${key}' component.`);
      }
    }

    this.#_.registry.set(key, cls);

    return cls;
  }

  get(key) {
    return this.#_.registry.get(key);
  }

  has(key) {
    return this.#_.registry.has(key);
  }
})();
