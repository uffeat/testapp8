/* Implements empty getter. */
export const empty = (parent, config, ...factories) => {
  return class empty extends parent {
    get empty() {
      return Object.keys(this).length === 0
    }
    
  };
};

export { empty as default };
