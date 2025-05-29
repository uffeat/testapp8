export default (parent, config) => {
  return class extends parent {
    #_ = {
      session: (() => {
        let s = 0;
        return () => s++;
      })(),
    };

    constructor() {
      super();
    }

    /* Retuns changes from most recent update data */
    get change() {
      return this.#_.change;
    }

    get current() {
      return this.#_.current;
    }

    get previous() {
      return this.#_.previous;
    }

    /* Updates data and notifies effects, if changes. Chainable. */
    update(/* TODO */) {
      if (this.effects.size /* TODO */) {
        const session = this.#_.session();

        this.effects.__call__(/* TODO */);
      }
    }
  };
};
