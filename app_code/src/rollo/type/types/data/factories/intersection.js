/* Implements intersection method. */
export const intersection = (parent, config, ...factories) => {
  return class intersection extends parent {
    /* Returns an object with items that represent items in 'other' that 
    are also in data items. */
    intersection(other) {
      return Object.fromEntries(
        Object.entries(other).filter(([k, v]) => this[k] == v)
      );
    }
  };
};

export { intersection as default };
