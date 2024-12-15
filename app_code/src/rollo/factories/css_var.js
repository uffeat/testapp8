/* Factory with enhanced features for managing component scoped css vars. */
export const css_var = (parent, config, ...factories) => {
  const cls = class CssVar extends parent {
    static PREFIX = '__'
    /* Provides getter/setter interface to component-scoped css var.
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
        .filter(([k, v]) => typeof k === 'string' && k.startsWith(CssVar.PREFIX))
        .forEach(
          ([k, v]) =>
            (this.__[k.slice(CssVar.PREFIX.length)] = v)
        );
      return this;
    }
  };
  return cls;
};
