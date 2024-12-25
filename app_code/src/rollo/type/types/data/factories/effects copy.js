/* Implements effects for reactive updates. */
export const effects = (parent, config, ...factories) => {
  return class effects extends parent {
    get effects() {
      return this.#effects;
    }
    #effects = new (class Effects {
      constructor(owner) {
        this.#owner = owner;
      }

      get owner() {
        return this.#owner;
      }
      #owner;

      /* Returns effects registry.
      NOTE
      - Can, but should generally not, be changed outside the Effects class. */
      get registry() {
        return this.#registry;
      }
      #registry = new Set();

      get size() {
        return this.registry.size;
      }

      add(effect) {
        this.registry.add(effect);
        effect({
          current: this.owner.data,
          previous: null,
          owner: this.owner,
        });
        return effect;
      }

      call(...args) {
        for (const effect of this.registry.values()) {
          effect(...args);
        }
      }

      has(effect) {
        return this.registry.has(effect);
      }

      remove(effect) {
        this.registry.delete(effect);
      }
    })(this);
  };
};
