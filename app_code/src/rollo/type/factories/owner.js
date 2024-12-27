/* . */
export const owner = (parent, config, ...factories) => {
  class owner extends parent {
    /* Returns owner. */
    get owner() {
      return this.#owner;
    }
    /* Sets owner. */
    set owner(owner) {
      this.#owner = owner;
    }
    #owner;
  };
  return owner;
};
