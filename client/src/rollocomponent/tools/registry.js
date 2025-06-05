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

    /* Retrieval of non-autonomous components from CustomElementRegistry is not
    supported by Safari (20250601). Therefore, use additional registry.
    It could be argued that registering autonomous components in this 
    additional registry is redundant. However, doing so is relatively cheap,
    and may support future features. */
    this.#_.registry.set(key, cls);
    return cls;
  }

  /* Returns registered web component. */
  get(key) {
    return this.#_.registry.get(key);
  }

  /* Checks, if web component with key has been registered. */
  has(key) {
    return this.#_.registry.has(key);
  }
})();
