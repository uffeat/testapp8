/* Implements condition getter/setter. */
export const condition = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'condition'
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

