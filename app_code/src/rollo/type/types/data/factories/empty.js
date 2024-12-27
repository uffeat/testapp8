/* Implements empty getter. */
export const empty = (parent, config, ...factories) => {
  return class empty extends parent {
    get empty() {
      return Object.keys(this.current).length === 0
    }
    
  };
};

