/* Implements call. */
export const call = (parent, config, ...factories) => {
  return class extends parent {
    static name = "call";

    /* Calls source. */
    call(...args) {
      if (this.source) {
        if (!this.condition || this.condition.call(this, ...args)) {
          return this.source.call(this, ...args);
        }
      }
    }
  };
};
