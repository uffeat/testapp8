export const detail = (parent, config, ...factories) => {
  return class extends parent {
    static name = "detail";

    /* Returns detail object.
    NOTE
    - Useful for storage of additional data. */
    get detail() {
      return this.#detail;
    }
    #detail = {};
  };
};
