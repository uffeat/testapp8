/* Implements 'intersection' method. */
export const intersection = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'intersection'
    /* Returns an object with items that represent items in 'other' that 
    are also in data items. */
    intersection(other) {
      return Object.fromEntries(
        Object.entries(other).filter(([k, v]) => this[k] == v)
      );
    }
  };
};

