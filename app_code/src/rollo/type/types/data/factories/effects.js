import { type } from "rollo/type/type";

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

        effect = Effect.create(effect, condition);
          effect.call({
            current: this.owner.current,
            previous: null,
            publisher: this.owner,
            session: null,
          });

        

        this.registry.add(effect);

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

class Effect {
  static create = (...args) => {
    const instance = new Effect(...args);
    return instance;
  };
  #source;

  constructor(source, condition) {
    this.#source = source;
    this.condition = condition;
  }

  get condition() {
    return this.#condition;
  }
  set condition(condition) {
    if (condition && typeof condition !== "function") {
      condition = interpret(condition);
    }
    this.#condition = condition;
  }
  #condition;

  call({ current, previous, publisher, session }) {
    current = type.create("data", current);
    previous = type.create("data", previous || {});
    if (
      !this.condition ||
      this.condition({ current, previous, publisher, session })
    ) {
      this.#source({ current, previous, publisher, session });
    }
  }
}

/* Creates and returns condition function from short-hand. */
function interpret(condition) {
  /* Create condition function from string short-hand */
  if (typeof condition === "string") {
    /* current must contain a key corresponding to the string short-hand. */
    return ({ current }) => condition in current;
  }

  if (Array.isArray(condition)) {
    /* Create condition function from array short-hand:
    current must contain a key that is present in the array short-hand. */
    return ({ current }) => {
      for (const key of condition) {
        if (key in current) return true;
      }
      return false;
    };
  }

  if (typeof condition === "object" && Object.keys(condition).length === 1) {
    /* Create condition function from single-item object short-hand:
    current must contain a key-value pair corresponding to the object short-hand. */

    /* TODO
    - use data methods
    */

    const key = Object.keys(condition)[0];
    const value = Object.values(condition)[0];
    return ({ current }) => current[key] === value;
  }

  throw new Error(`Invalid condition: ${condition}`);
}
