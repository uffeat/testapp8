/* Implements difference method. */
export const difference = (parent, config, ...factories) => {
  return class difference extends parent {
    /* Returns an object with items that represent items in 'other' that are 
    different from those in data items. */
    difference(other) {
      return Object.fromEntries(
        Object.entries(other).filter(([k, v]) => {
          if (v === undefined) {
            return true;
          } else {
            return this[k] !== v;
          }
        })
      );
    }
  };
};
