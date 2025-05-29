export default (parent, config) => {
  return class extends parent {
    #_ = {};

    /* Returns owner. */
    get owner() {
      return this.#_.owner;
    }

    /* Sets owner. */
    set owner(owner) {
      this.#_.owner = owner;
    }
  };
};
