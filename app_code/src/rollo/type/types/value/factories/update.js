/* Implements update method. */
export const update = (parent, config, ...factories) => {
  return class extends parent {
    static name = "update";

    /* */
    update(update) {
      if (
        [null, undefined].includes(update) ||
        ["boolean", "number", "string"].includes(typeof update)
      ) {
        this.current = update;
        return this;
      }

      for (const [k, v] of Object.entries(update)) {
        this[k] = v;
      }
      return this;
    }
  };
};
