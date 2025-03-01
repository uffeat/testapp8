import { constants } from "@/rollo/component/tools/constants";

const { ARIA, CSS_CLASS } = constants;

export const classes = (parent, config, ...factories) => {
  return class extends parent {
    static name = "classes";

    #classes;

    constructor() {
      super();
      this.#classes = new Proxy(this, {
        /* NOTE Cannot validate key, since 'in classList' checks actual classes */
        get(target, key) {
          return (...args) => target.classList[key](...args);
        },
      });
    }

    /* Returns controller for CSS classes */
    get classes() {
      return this.#classes;
    }

    /* Updates attributes. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);
      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(CSS_CLASS))
        .forEach(([k, v]) => {
          this.classList[v ? "add" : "remove"](k.slice(CSS_CLASS.length));
        });
      return this;
    }
  };
};
