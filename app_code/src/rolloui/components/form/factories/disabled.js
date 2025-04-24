export const disabled = (parent, config, ...factories) => {
  return class extends parent {
    static name = "disabled";

    /* Returns disabled. */
    get disabled() {
      return this.attribute.disabled || false;
    }
    /* Sets disabled. */
    set disabled(disabled) {
      const { input } = this.__elements__;
      this.attribute.disabled = input.attribute.disabled = disabled;
    }
  };
};
