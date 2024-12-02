/* Factory for all web components. */
export const clear = (parent, config, ...factories) => {
  const cls = class Clear extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Removes all children. Chainable. */
    clear() {
      while (this.firstChild) {
        this.firstChild.remove();
      }
      return this;
    }
  };
  return cls;
};
