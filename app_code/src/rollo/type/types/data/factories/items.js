/* Implements 
- getters as alternatives to using staic Object methods
- 'size' as a normlized property for length of keys.
-  'data' as means to extract data, and not accessor, properties.   */
export const items = (parent, config, ...factories) => {
  return class items extends parent {
    /* Returns entries. */
    get entries() {
      return Object.entries(this);
    }

    /* Returns keys. */
    get keys() {
      return Object.keys(this);
    }

    

    /* Returns length of keys. */
    get size() {
      return Object.keys(this).length;
    }

    /* Returns values. */
    get values() {
      return Object.values(this);
    }
  };
};
