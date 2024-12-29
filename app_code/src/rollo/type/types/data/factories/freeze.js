/* Implements freeze method. */
export const freeze = (parent, config, ...factories) => {
  return class freeze extends parent {
    static name = 'freeze'
    /* Freezes current data shallowly. Chainable. */
    freeze() {
      return Object.freeze(this);
    }
  };
};
