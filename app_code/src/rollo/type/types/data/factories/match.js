/* Implements 'match' method. */
export const match = (parent, config, ...factories) => {
  return class match extends parent {
    /* Tests, if 'other' contains the same key-value pairs as data. */
    match(other) {
      try {
        const entries = Object.entries(other);
      if (entries.length !== this.size) {
        return false;
      }
      for (const [k, v] of entries) {
        if (this[k] !== v) {
          return false;
        }
      }
      return true;
      } catch {
        return false;
      }


      
    }
  };
};
