/* 

*/

export const type = (parent, config, ...factories) => {
  return class extends parent {
    static name = "type";

    __init__() {
      super.__init__?.();
      /* Provide default type. */
      if (!this.type) {
        this.type = "text";
      }
    }

    /* Returns type. */
    get type() {
      return this.attribute.type;
    }
    /* Sets type. */
    set type(type) {
      const { input } = this.__elements__;
      this.attribute.type= input.type = type;
    }
  };
};
