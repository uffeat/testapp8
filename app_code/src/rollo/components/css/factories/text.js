/* Factory for text prop. */
export const text = (parent, config, ...factories) => {
  const cls = class Text extends parent {
    /* Returns text representation of rule.
    NOTE Primarily for dev. */
    get text() {
      if (this.rule) {
        return this.rule.cssText;
      }
    }
  };
  return cls;
};
