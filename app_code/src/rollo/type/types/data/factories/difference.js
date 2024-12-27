/* Implements difference method. */
export const difference = (parent, config, ...factories) => {
  return class difference extends parent {
    /* Returns an object with items that represent
    - if reverse is false, items in 'other' that are different from those 
      in data items. 
    - if reverse is true, data items that are in 'other' and are different 
      from those in data items.
    */
    difference(other, reverse = false) {
      if (reverse) {
        return Object.fromEntries(
          Object.entries(other).filter(([k, v]) => this.current[k] !== v).map(([k, v]) => [k, this.current[k]])
        );
      } else {
        return Object.fromEntries(
          Object.entries(other).filter(([k, v]) => {
            if (v === undefined) {
              return true;
            } else {
              return this.current[k] !== v;
            }
          })
        );
      }
      
    }
  };
};

