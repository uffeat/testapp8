export const match = (parent, config, ...factories) => {
  return class extends parent {
    static name = "match";

    /* Tests, if 'other' contains the same key-value pairs as current data. */
    match(other) {
      if (
        typeof other !== "object" ||
        Array.isArray(other) ||
        other === null ||
        typeof other === "function"
      ) {
        return false;
      }
      if (other.__type__ === "data") {
        return this.#match(other.current);
      }
      try {
        /* Ignore items with undefined values */
        other = Object.fromEntries(
          Object.entries(other).filter(([k, v]) => v !== undefined)
        );
        return this.#match(other);
      } catch {
        return false;
      }
    }

    #match(other) {
      if (this.size !== Object.keys(other).length) {
        return false;
      }
      for (const [key, value] of Object.entries(other)) {
        if (value !== this.current[key]) {
          return false;
        }
      }
      return true;
    }
  };
};
