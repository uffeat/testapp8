/* Implements 
- getters as alternatives to using staic Object methods
- 'size' as a normalized property for length of keys.
*/
export const items = (parent, config, ...factories) => {
  return class items extends parent {
    /* Returns entries ('items' alias). */
    get entries() {
      return this.items;
    }

    /* Returns entries. */
    get items() {
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
