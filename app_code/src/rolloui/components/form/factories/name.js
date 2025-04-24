/* 

*/

export const name = (parent, config, ...factories) => {
  return class extends parent {
    static name = "name";

    /* Returns name. */
    get name() {
      return this.attribute.name;
    }
    /* Sets name. */
    set name(name) {
      const { input } = this.__elements__;
      this.attribute.name = input.name = name;
    }
  };
};
