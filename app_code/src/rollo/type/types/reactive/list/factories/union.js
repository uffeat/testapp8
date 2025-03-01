export const union = (parent, config, ...factories) => {
  return class extends parent {
    static name = "union";

   

    /* Returns unique-value array that represents a merge between current and 
    other. */
    union(other) {
      /* Allow other to be a List instance */
      if (other && other.__type__ === "list") {
        other = other.current;
      }
      other = new Set(other);
      const current = this.__dict__.current;
      return [...current.union(other)];
    }
  };
};
