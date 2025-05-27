export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
      const owner = this;
      this.#_.classes = new (class {
        add(classes) {
          classes && owner.classList.add(...classes.split("."));
          return owner;
        }
      })();
    }

    get classes() {
      return this.#_.classes;
    }
  };
};
