
export const detail = (parent, config, ...factories) => {
  return class extends parent {
    static name = "detail";

    #detail = {};

    /* Returns detail. */
    get detail() {
      return this.#detail;
    }
    /* Sets detail. */
    set detail(detail) {
      this.#detail = detail;
    }
  };
};
