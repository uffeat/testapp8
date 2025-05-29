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

        add(effect, ...args) {
          let condition = args.find(
            (a) => typeof a === "function" || (typeof a === "object" && a.call)
          );

          /* TODO short-hand */

          const options =
            args.find(
              (a) =>
                typeof a === "object" &&
                !(typeof a === "function") &&
                !Array.isArray(a)
            ) || {};

          this.#_.registry.set(effect, condition);

          /* TODO run */

          return effect;
        }

        __call__(/* TODO */) {
          this.#_.registry.entries().forEach(([effect, condition], index) => {
            /* TODO */
          });
        }

        has(effect) {
          return this.#_.registry.has(effect);
        }

        remove(effect) {
          this.#_.registry.delete(effect);
          return owner;
        }
      })();
    }

    /* */
    get effects() {
      return this.#_.effects;
    }
  };
};
