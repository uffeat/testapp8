export const detail = (parent, config, ...factories) => {
  return class extends parent {
    static name = "detail";

    #detail = {};

    get detail() {
      return this.#detail;
    }
    set detail(detail) {
      this.#detail = detail;
      if (typeof detail === 'string') {
        this.setAttribute('detail', detail)
      } else if (detail === true) {
        this.setAttribute('detail', '')
      } else {
        this.removeAttribute('detail')
      }
    }
  };
};
