import { Effect } from "rollo/type/types/data/tools/effect";

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
            return instance.call(...args);
          },
        });
      }

      /* Returns max number of effects allowed. */
      get max() {
        return this.#max;
      }
      /* Sets max number of effects allowed.
      NOTE
      - null/undefined removes limit.
      */
      set max(max) {
        this.#max = max;
      }
      #max = 10;

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
      add(effect, condition) {
        if (![null, undefined].includes(this.max) && this.size >= this.max) {
          throw new Error(`Cannot register more than ${this.max} effects.`);
        }
        /* Create effect */
        effect = Effect.create(effect, condition);
        /* Call effect */
        effect.call({
          current: this.owner.current,
          previous: null,
          publisher: this.owner,
          session: null,
        });
        /* Register effect */
        this.registry.add(effect);
        /* Return effect, e.g., for control and later removal */
        return effect;
      }

      /* Calls registered effects. */
      call({ current, previous }) {
        for (const effect of this.registry.values()) {
          effect.call({
            current,
            previous,
            publisher: this.owner,
            session: ++this.#session,
          });
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

      #session = 0;
    })(this);
  };
};
