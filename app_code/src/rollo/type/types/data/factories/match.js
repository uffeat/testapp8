/* Implements 'match' method. */
export const match = (parent, config, ...factories) => {
  return class match extends parent {
    /* Tests, if 'other' contains the same key-value pairs as data. */
    match(other) {
      const entries = Object.entries(other);
      if (entries.length !== this.size) {
        return false;
      }
      for (const [key, value] of entries) {
        if (this[key] !== value) {
          return false;
        }
      }
      return true;
    }
  };
};
