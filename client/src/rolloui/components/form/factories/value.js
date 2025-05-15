/* 

*/

export const value = (parent, config, ...factories) => {
  return class extends parent {
    static name = "value";

    /* . */
    __new__() {
      super.__new__?.();
      const {input} = this.__elements__;
      /* UI -> value state */
      input.on.input = (event) =>
        this.value = input.value.trim() === ""
      ? null
      : input.value;
      /* Value state -> UI */
      this.states.value.effects.add(
        ({ current }) => (input.value = current)
      );
      /* Value state -> attribute */
      this.states.value.effects.add(
        ({ current }) => this.attribute.value = current
      );
    }

    /* Returns value state. */
    get value() {
      return this.states.value.current;
    }
    /* Sets value state. */
    set value(value) {
      this.states.value.update(value);
    }
  };
};
