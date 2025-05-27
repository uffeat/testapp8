export default (parent, config) => {
  return class extends parent {
    /* Updates accessor props. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(([k, v]) => k in this.style)
        .forEach(([k, v]) => (this.style[k] = v));
      return this;
    }
  };
};
