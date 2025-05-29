export default (parent, config) => {
  return class extends parent {
    #_ = {};

    /* Returns name. */
    get name() {
      return this.#_.name;
    }

    /* Sets name. */
    set name(name) {
      this.#_.name = name;
    }
  };
};
