/* Implements 
- getters as alternatives to using staic Object methods
- 'size' as a normalized property for length of keys.
*/
export const items = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'items'



    /* Returns object with shallow copy of data properties.
    NOTE
    - 'current' alias; provided for shorter syntax.
    */
    get data() {
      return this.current;
    }

     /* Returns object with shallow copy of data properties. */
    get current() {
      return { ...this };
    }

    /* Returns entries. */
    get entries() {
      return Object.entries(this);
    }

    /* Returns entries. 
    NOTE
    - 'entries' alias; provided for shorter syntax.
    */
    get items() {
      return this.entries;
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
