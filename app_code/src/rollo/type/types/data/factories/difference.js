/* Implements difference method. */
export const difference = (parent, config, ...factories) => {
  return class difference extends parent {
    /* Returns an object with items that represent items in 'data' that are 
    different from chose in self data items. */
    difference(data) {
      return Object.fromEntries(
        Object.entries(data).filter(([k, v]) => this[k] !== v)
      );
    }
  };
};
