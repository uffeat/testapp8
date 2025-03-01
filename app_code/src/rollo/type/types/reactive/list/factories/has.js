export const has = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'has'

    /* Tests, if current includes value.  */
    has(value) {
      return this.current.includes(value);
    }
    
    
  };
};
