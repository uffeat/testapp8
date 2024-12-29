/* Implements '__owner__' getter/setter. */
export const __owner__ = (parent, config, ...factories) => {
  return class __owner__ extends parent {
    static name = '__owner__'
    /* Returns __owner__. */
    get __owner__() {
      return this.#__owner__;
    }
    /* Sets __owner__. */
    set __owner__(__owner__) {
      this.#__owner__ = __owner__;
    }
    #__owner__;
  };
};
