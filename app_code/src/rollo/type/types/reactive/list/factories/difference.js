export const difference = (parent, config, ...factories) => {
  return class extends parent {
    static name = "difference";

    /* Returns array that represents values that are in current, but not in other.
    NOTE
    - With mode 'other', returns array that represents values that are in other, 
      but not in current. 
    - With mode "symmetric", returns array that represents symmetric difference.*/
    difference(other, mode) {
      /* Allow other to be a List instance */
      if (other && other.__type__ === "list") {
        other = other.current;
      }
      other = new Set(other);
      const current = this.__dict__.current;

      if (mode === undefined || mode === false) {
        return [...current.difference(other)];
      }

      if (mode === "other" || mode === true) {
        return [...other.difference(current)];
      }
      if (mode === "symmetric" || mode === null) {
        return [...current.symmetricDifference(other)];
      }
      throw new Error(`Invalid mode: ${String(mode)}`);
    }
  };
};
