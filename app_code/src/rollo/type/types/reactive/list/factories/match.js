export const match = (parent, config, ...factories) => {
  return class extends parent {
    static name = "match";

   

    /* Tests, if other contains the same values as current.
    NOTE
    - NOT sensitive to order. */
    match(other) {
      /* Allow other to be a List instance */
      if (other && other.__type__ === "list") {
        other = other.current;
      }
      try {
        other = new Set(other);
      } catch {
        return false;
      }

      const current = this.__dict__.current;
      return current.symmetricDifference(other).size === 0;
    }
  };
};
