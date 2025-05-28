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
          /* condition from short-hand (any array) */
          if (!condition) {
            for (const a of args) {
              if (Array.isArray(a)) {
                condition = (change) => {
                  for (const k of change) {
                    if (a.includes(k)) return true;
                  }
                  return false;
                };
                break;
              }
            }
          }
          const options =
            args.find(
              (a) =>
                typeof a === "object" &&
                !(typeof a === "function") &&
                !Array.isArray(a)
            ) || {};

          this.#_.registry.set(effect, condition);

          if (options.run) {
            if (!condition || condition(owner.change)) {
              effect.call(null, owner.change, {
                current: owner.current,
                index: null,
                owner,
                previous: owner.previous,
                effect,
                session: null,
              });
            }
          }

          return effect;
        }

        __call__(change, { current, previous, session } = {}) {
          this.#_.registry.entries().forEach(([effect, condition], index) => {
            if (!condition || condition(change)) {
              effect.call(null, change, {
                current,
                index,
                owner,
                previous,
                effect,
                session,
              });
            }
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
