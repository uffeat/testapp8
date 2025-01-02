/* Implements difference method. */
export const difference = (parent, config, ...factories) => {
  return class extends parent {
    static name = "difference";
    /* Returns an object with items that represent,
    - if reverse is false, items in 'other' that are different from those 
      in data items. 
    - if reverse is true, data items that are in 'other' and are different 
      from those in data items.
    */
    difference(other, reverse = false) {
      if (reverse) {
        return Object.fromEntries(
          Object.entries(other)
            .filter(([k, v]) => this[k] !== v)
            .map(([k, v]) => [k, this[k]])
        );
      } else {
        return Object.fromEntries(
          Object.entries(other).filter(([k, v]) => {
            if (v === undefined) {
              return true;
            } else {
              if (this[k] && this[k].match) {
                return !this[k].match(v);
              } else {
                return this[k] !== v;
              }
            }
          })
        );
      }
    }
  };
};
