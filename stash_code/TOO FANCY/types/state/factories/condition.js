/* Factory for write-once condition property. */
export const condition = (parent, config, ...factories) => {
  const cls = class condition extends parent {
    /* Returns condition. */
    get condition() {
      return this.#condition;
    }
    /* Sets condition. */
    set condition(condition) {
      if (this.#condition) {
        throw new Error(`'condition' cannot be changed.`);
      }
      this.#condition = condition;
    }
    #condition;
  };
  return cls;
};
