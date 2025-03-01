export const value = (parent, config, ...factories) => {
  return class extends parent {
    static name = "value";

    get value() {
      return this.#value;
    }
    set value(value) {
      if (value === true) {
        this.setAttribute("value", "");
      } else if (["number", "string"].includes(typeof value)) {
        this.setAttribute("value", value);
      } else {
        this.removeAttribute("value");
      }
      this.#value = value;
    }
    #value;
  };
};
