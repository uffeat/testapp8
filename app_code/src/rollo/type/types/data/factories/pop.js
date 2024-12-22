/* . */
export const pop = (parent, config, ...factories) => {
  return class pop extends parent {
    
    /* Deletes item by key and returns value of deleted item. */
    pop(key) {
      const value = this[key];
      delete this[k];
      return value;
    }
  };
};
