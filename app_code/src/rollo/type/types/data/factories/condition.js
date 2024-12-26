/* Implements condition getter/setter. */
export const condition = (parent, config, ...factories) => {
  return class condition extends parent {
    /* Returns condition. */
    get condition() {
      return this.#condition;
    }
    /* Sets condition. */
    set condition(condition) {
      this.#condition = condition;
    }
    #condition;
  };
};

export { condition as default };
