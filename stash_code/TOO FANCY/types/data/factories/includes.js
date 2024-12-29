/* Implements 'includes' method. */
export const includes = (parent, config, ...factories) => {
  return class includes extends parent {
    /* Tests, if all items in 'other' are also in current data. */
    includes(other) {
      for (const [k, v] of Object.entries(other)) {
        if (v === undefined) {
          return false;
        }
        if (this[k] !== v) {
          return false;
        }
      }
      return true;
    }
  };
};
