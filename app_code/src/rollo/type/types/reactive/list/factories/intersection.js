export const intersection = (parent, config, ...factories) => {
  return class extends parent {
    static name = "intersection";

   

    /* Returns array of values that current has in common with other. */
    intersection(other) {
      /* Allow other to be a List instance */
      if (other && other.__type__ === "list") {
        other = other.current;
      }
      other = new Set(other);
      const current = this.__dict__.current;
      return [...current.intersection(other)];
    }
  };
};
