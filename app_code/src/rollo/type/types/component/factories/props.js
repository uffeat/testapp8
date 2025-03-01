export const props = (parent, config, ...factories) => {
  const CSS_VAR = config.CSS_VAR;
  return class extends parent {
    static name = "props";

    /* Updates accessor props. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);

      Object.entries(updates)
        .filter(
          ([k, v]) => k in this || (k.startsWith("_") && !k.startsWith(CSS_VAR))
        )
        .forEach(([k, v]) => (this[k] = v));

      return this;
    }
  };
};
