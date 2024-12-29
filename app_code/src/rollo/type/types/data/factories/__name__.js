/* Implements '__name__' getter/setter. */
export const __name__ = (parent, config, ...factories) => {
  return class __name__ extends parent {
    static name = '__name__'
    /* Returns __name__. */
    get __name__() {
      return this.#__name__;
    }
    /* Sets __name__. */
    set __name__(__name__) {
      this.#__name__ = __name__;
    }
    #__name__;
  };
};
