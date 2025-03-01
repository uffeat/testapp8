import { constants } from "@/rollo/component/tools/constants";

const { CSS_VAR } = constants;

export const css_vars = (parent, config, ...factories) => {
  return class extends parent {
    static name = "css_vars";

    get __() {
      return this.#__;
    }
    #__ = new Proxy(this, {
      get(target, k) {
        return getComputedStyle(target).getPropertyValue(`--${k}`).trim();
      },
      set(target, k, v) {
        if (v === undefined) return true;
        if (v === false || v === null) {
          /* TODO
          - Add priority
          */
          target.style.removeProperty(`--${k}`);
        } else {
          target.style.setProperty(`--${k}`, v);
        }
        return true;
      },
    });

    /* Updates css vars. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);

      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(CSS_VAR))
        .forEach(([k, v]) => (this.__[k.slice(CSS_VAR.length)] = v));

      return this;
    }
  };
};
