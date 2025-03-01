/* Implements 'owner' getter/setter. */
export const owner = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'owner'
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
};
