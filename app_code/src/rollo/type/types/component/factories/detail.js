export const detail = (parent, config, ...factories) => {
  return class extends parent {
    static name = "detail";

    #detail = {};

    get detail() {
      return this.#detail;
    }
    set detail(detail) {
      this.#detail = detail;
    }
  };
};
