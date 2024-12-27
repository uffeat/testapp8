/* Implements 'pop' method. */
export const pop = (parent, config, ...factories) => {
  return class pop extends parent {
    /* Deletes item by key and returns value of deleted item. */
    pop(key) {
      /* Mutate via 'update' to ensure centralized mutation */
      const value = this[key];
      this.update({ [key]: undefined });
      return value;
    }
  };
};
