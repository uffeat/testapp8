export const size = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'size'

    /* Returns number of items in current */
    get size() {
      return this.current.length;
    }
    
    
  };
};
