import { constants } from "rollo/constants";

/* Factory with enhanced features for managing component scoped css vars. */
export const css_var = (parent, config, ...factories) => {
  const cls = class CssVar extends parent {
    /* Returns prop-like getter/setter interface to component-scoped css var.
    Supports:
    - '__'-syntax
    - iife's (undefined values are ignored) */
    get __() {
      return this.#__;
    }
    #__ = new Proxy(this, {
      get(target, key) {
        return getComputedStyle(target).getPropertyValue(`--${key}`).trim();
      },
      set(target, key, value) {
        if (typeof value === "function") {
          value = value.call(target);
        }
        if (value === undefined) return true;
        if (value) {
          target.style.setProperty(`--${key}`, value);
        } else {
          target.style.removeProperty(`--${key}`);
        }
        return true;
      },
    });

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates = {}) {
      super.update && super.update(updates);
      /* Update css vars */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.CSS_VAR))
        .forEach(
          ([key, value]) =>
            (this.__[key.slice(constants.CSS_VAR.length)] = value)
        );
      return this;
    }
  };
  return cls;
};
