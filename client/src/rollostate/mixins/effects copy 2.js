export default (parent, config) => {
  return class extends parent {
    #_ = {};

    constructor() {
      super();
      const owner = this

      this.#_.effects = new (class {
        #_ = {
          registry: new Map(),
        };

        get size() {
          return this.#_.registry.size
        }

        add(effect, { condition } = {}) {
          this.#_.registry.set(effect, condition);
          return effect;
        }

        notify(change) {
          for (const [effect, condition] of this.#_.registry.entries()) {
            if (!condition || condition(change)) {
              effect(change, {owner})
            }
          }



         

        }
      })();
    }

    /* */
    get effects() {
      return this.#_.effects
    }
  };
};
