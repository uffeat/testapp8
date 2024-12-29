/* Implements empty getter. */
export const empty = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'empty'
    /* Test, if data has items. */
    get empty() {
      return Object.keys(this).length === 0
    }
    
  };
};

