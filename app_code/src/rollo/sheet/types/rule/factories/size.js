export const size = (parent, config, ...factories) => {
  return class extends parent {
    static name = "size";

    /* Returns number of items. */
    size() {
      return this.rule.style.length;
    }
  };
};
