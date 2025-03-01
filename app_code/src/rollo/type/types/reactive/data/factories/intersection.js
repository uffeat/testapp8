export const intersection = (parent, config, ...factories) => {
  return class extends parent {
    static name = "intersection";

    /* Returns an object with items that represent items in 'other' that 
    are also in current data. */
    intersection(other) {
      if (other && other.__type__ === "data") {
        other = other.current;
      }
      return Object.fromEntries(
        Object.entries(other).filter(([k, v]) => this.current[k] == v)
      );
    }

   
  };
};
