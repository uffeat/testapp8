import { Effects } from "rollo/type/types/data/tools/effects";

/* Implements 'effects' getter. */
export const effects = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'effects'
    /* Returns effects controller. */
    get effects() {
      return this.#effects;
    }
    #effects = Effects.create({owner: this, current: () => this.values, transformer: (effect) => (argument) =>
      Change.create({
        effect,
        ...argument,
      })});
  };
};


/* Argument for effect sources and effect conditions. */
class Change {
  static create = (...args) => new Change(...args);

  constructor({ added, effect, index, removed, publisher, session }) {
    this.#effect = effect;
    this.#index = index;

    this.#added = added;
    this.#removed = removed;

    this.#publisher = publisher;
    this.#session = session;
    this.#time = Date.now();
  }

  /* Returns added values. */
  get added() {
    return this.#added;
  }
  #added;

  /* Returns effect.
  NOTE
  - Provides easy access to the effect itself from inside the effect 
    source/condition.
  */
  get effect() {
    return this.#effect;
  }
  #effect;

  /* Returns effect index for the current session. */
  get index() {
    return this.#index;
  }
  #index;

  /* Returns removed values. */
  get removed() {
    return this.#removed;
  }
  #removed;

  /* Returns publisher. */
  get publisher() {
    return this.#publisher;
  }
  #publisher;

  /* Returns session id. */
  get session() {
    return this.#session;
  }
  #session;

  /* Returns timestamp. */
  get time() {
    return this.#time;
  }
  #time;
}

/* Creates and returns condition function from short-hand. */
function interpret(condition) {
  if (typeof condition === "string") {
    /* Create condition function from string short-hand:
    current must contain a key corresponding to the string short-hand. */
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
    return ({ current }) =>
      type.create("data", { ...current }).includes(condition);
  }

  throw new Error(`Invalid condition: ${condition}`);
}
