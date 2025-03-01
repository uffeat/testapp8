export const includes = (parent, config, ...factories) => {
  return class extends parent {
    static name = "includes";

    /* Tests, if other included in current. 
    NOTE
    - With mode flag true, tests, if current included in other. */
    includes(other, mode = false) {
      /* Allow other to be a List instance */
      if (other && other.__type__ === "list") {
        other = other.current;
      }
      other = new Set(other);
      const current = this.__dict__.current;
      if (mode === false) {
        return other.isSubsetOf(current);
      }
      if (mode === true) {
        return current.isSubsetOf(other);
      }
      throw new Error(`Invalid mode: ${String(mode)}`);
    }
  };
};
