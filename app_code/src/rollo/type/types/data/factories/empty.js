/* Implements empty getter. */
export const empty = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'empty'
    /* Test, if data has items. */
    get empty() {
      return this.keys.length === 0
    }
    
  };
};

