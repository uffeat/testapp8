/* Implements 'pop' method. */
export const pop = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'pop'
    /* Deletes item by key and returns value of deleted item. */
    pop(key) {
      /* Mutate via 'update' to ensure centralized mutation.
      Prevents redundant effect calls. */
      const value = this.current[key];
      this.update({ [key]: undefined });
      return value;
    }
  };
};
