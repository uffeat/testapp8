/* Base factory for all web components. */
export const properties = (parent, config, ...factories) => {
  const cls = class Properties extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Updates properties. */
    update(updates = {}) {
      super.update && super.update(updates);

      Object.entries(updates)
        .filter(
          ([key, value]) =>
            key in this || (key.startsWith("_") && !key.startsWith("__"))
        )
        .forEach(([key, value]) => (this[key] = value));
    }
  };
  return cls;
};
