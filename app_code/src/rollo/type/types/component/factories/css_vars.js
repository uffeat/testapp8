
export const css_vars = (parent, config, ...factories) => {
  const CSS_VAR = config.CSS_VAR;

  return class extends parent {
    static name = "css_vars";

    get __() {
      return this.#__;
    }
    #__ = new Proxy(this, {
      get(target, key) {
        return getComputedStyle(target).getPropertyValue(`--${key}`).trim();
      },
      set(target, key, value) {
        if (value === undefined) return true;
        if (value === false || value === null) {
          target.style.removeProperty(`--${key}`);
        } else {
          target.style.setProperty(`--${key}`, value);
        }
        return true;
      },
    });

    /* Updates css vars. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);

      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(CSS_VAR))
        .forEach(([k, v]) => this.__[k.slice(CSS_VAR.length)] = v);

      return this;
    }
  };
};
