/* Implements effects for reactive updates. */
export const effects = (parent, config, ...factories) => {
  return class effects extends parent {
    get effects() {
      return this.#effects;
    }
    #effects = new (class Effects extends Function {
      /* Returns proxy-wrapped Effects instance. */
      constructor(owner) {
        super();
        this.#owner = owner;
        const instance = this;

        return new Proxy(instance, {
          get: (target, key) => {
            return instance[key];
          },
          set: (target, key, value) => {
            instance[key] = value;
            return true;
          },
          /* Enable 'in' check as alternative to 'has' */
          has: (target, effect) => {
            return instance.has(effect);
          },
          /* Enable direct call of 'call' */
          apply: (target, thisArg, args) => {
            return instance.call.apply(instance, args);
          },
        });
      }

      /* Returns owner */
      get owner() {
        return this.#owner;
      }
      #owner;

      /* Returns effects registry.
      NOTE
      - Can, but should generally not, be changed outside the Effects class. 
      */
      get registry() {
        return this.#registry;
      }
      #registry = new Set();

      /* Returns number of effects registered. */
      get size() {
        return this.registry.size;
      }

      /* Returns and registers effect. */
      add(effect) {
        this.registry.add(effect);
        effect({
          current: this.owner.data,
          previous: null,
          owner: this.owner,
          session: null
        });
        return effect;
      }

      /* Calls registered effects. */
      call({ current, previous }) {
        for (const effect of this.registry.values()) {
          effect({ current, previous, owner: this.owner, session: ++this.#session });
        }
      }

      /* Tests, if effect is registered. */
      has(effect) {
        return this.registry.has(effect);
      }

      /* Deregisters effect. */
      remove(effect) {
        this.registry.delete(effect);
      }

      #session = 0
    })(this);
  };
};
