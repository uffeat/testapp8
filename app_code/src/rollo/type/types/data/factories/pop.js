/* Implements pop method. */
export const pop = (parent, config, ...factories) => {
  return class pop extends parent {
    /* Deletes item by key and returns value of deleted item. */
    pop(key) {
      /* NOTE
      - Mutates via 'update' to ensure centralized mutation.
      */
      const value = this[key];
      this.update({[key]: undefined})
      return value;



      // Old
      //const value = this[key];
      //delete this[k];
      //return value;
    }
  };
};
