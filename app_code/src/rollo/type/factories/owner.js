/* Factory for write-once owner property. */
export const owner = (parent, config, ...factories) => {
  class owner extends parent {
    /* Returns owner. */
    get owner() {
      return this.#owner;
    }
    /* Sets owner. */
    set owner(owner) {
      if (this.#owner) {
        throw new Error(`'owner' cannot be changed.`);
      }
      this.#owner = owner;
    }
    #owner;
  };
  return owner;
};
