/* Base factory for all web components. */
export const properties = (parent, config, ...factories) => {
  const cls = class Properties extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Updates properties. Returns unhandled updates. */
    update(updates = {}) {
      if (super.update) {
        updates = super.update(updates);
      }

      Object.entries(updates)
        .filter(this.#update_filter)
        .forEach(([key, value]) => (this[key] = value));

      return Object.fromEntries(Object.entries(updates).filter(
        ([key, value]) => !this.#update_filter([key, value])
      ))
      
      
      
      
    }
    #update_filter = ([key, value]) => key in this || (key.startsWith("_") && !key.startsWith("__"))
  };
  return cls;
};
