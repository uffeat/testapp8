/* Implements 'match' method. */
export const match = (parent, config, ...factories) => {
  return class extends parent {
    static name = "match";
    /* Tests, if 'other' contains the same key-value pairs as data. */
    match(other) {
      const entries = Object.entries(other);
      if (entries.length !== this.size) {
        return false;
      }
      for (const [k, v] of entries) {
        if (this[k] && this[k].match) {
          if (!this[k].match(v)) {
            return false;
          }
        } else {
          if (this[k] !== v) {
            return false;
          }
        }
      }
      return true;
    }
  };
};
