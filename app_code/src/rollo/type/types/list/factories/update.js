/* . */
export const update = (parent, config, ...factories) => {
  return class extends parent {
    static name = "update";

    update(update) {
      if (!update) return this;
      for (const [k, v] of Object.entries(update)) {
        if (v === undefined) {
          delete this[k];
        } else {
          this[k] = v;
        }
      }

      return this;
    }
  };
};
