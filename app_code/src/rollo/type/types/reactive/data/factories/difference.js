export const difference = (parent, config, ...factories) => {
  return class extends parent {
    static name = "difference";

    /* Returns an object with items that represent,
    - if mode is undefined or false, items that are in current, but not in other. 
    - if mode is 'other' or true, items that are in 'other', but not in current. 
    - if mode is 'symmetric' or null, that other and current do not share. */
    difference(other, mode) {
      const current = this.current;

      if (other && other.__type__ === "data") {
        other = other.current;
      }

      if (mode === undefined || mode === false) {
        return Object.fromEntries(
          Object.entries(other)
            .filter(([k, v]) => current[k] !== v)
            .map(([k, v]) => [k, current[k]])
        );
      }

      if (mode === "other" || mode === true) {
        return Object.fromEntries(
          Object.entries(other).filter(([k, v]) => {
            if (v === undefined) {
              return true;
            }
            return current[k] !== v;
          })
        );
      }

      if (mode === "symmetric" || mode === null) {
        const result = [];
        for (const [key, value] of Object.entries(other)) {
          if (current[key] !== value) {
            result.push([key, value]);
          }
        }
        for (const [key, value] of this.entries) {
          if (other[key] !== value) {
            result.push([key, value]);
          }
        }
        return [...new Set(result)];
      }
      throw new Error(`Invalid mode: ${String(mode)}`);
    }
  };
};
