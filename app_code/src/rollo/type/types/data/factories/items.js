/* Factory for enhancing plain object features, notably:
- Batch updating.
- Conditional mutation with (chainable) methods that resemble 
  (mutating versions of) array methods.
- Properties that reduce the need for using static Object methods. */
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
