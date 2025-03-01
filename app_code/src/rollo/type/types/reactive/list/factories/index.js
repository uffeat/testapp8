export const index = (parent, config, ...factories) => {
  return class extends parent {
    static name = "index";

    /* Returns index of value. */
    index(value) {
      for (const [index, _value] of this.entries) {
        if (value === _value) {
          return index;
        }
      }
      return null;
    }
  };
};
