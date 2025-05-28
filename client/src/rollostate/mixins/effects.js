export default (parent, config) => {
  return class extends parent {
    #_ = {};

    constructor() {
      super();
      const owner = this;

      this.#_.effects = new (class {
        #_ = {
          registry: new Map(),
        };

        get size() {
          return this.#_.registry.size;
        }

        add(effect, { condition } = {}) {
          this.#_.registry.set(effect, condition);
          return effect;
        }

        notify(change) {
          this.#_.registry.entries().forEach(([effect, condition]) => {
            if (!condition || condition(change)) {
              effect(change, { owner, self: effect });
            }
          });
        }
      })();
    }

    /* */
    get effects() {
      return this.#_.effects;
    }
  };
};
