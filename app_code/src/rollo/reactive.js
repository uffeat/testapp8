/*  */
export class Reactive {
  static create = (...args) => {
    return new Reactive(...args);
  };

  constructor({ data, name, owner } = {}) {
    this.#name = name;
    this.#owner = owner;
    if (data) {
    }
  }

  /* Returns name. */
  get name() {
    return this.#name;
  }
  #name;

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* . */
  get $() {
    return this.#$;
  }
  #$ = new Proxy(this, {
    get: (target, key) => {
      return target.#current[key];
    },
    set: (target, key, value) => {
      target.update({ [key]: value });
      return true;
    },
  });

  /* . */
  get current() {
    return this.#current;
  }
  #current = {};

  /* Returns controller for managing effects. */
  get effects() {
    return this.#effects;
  }
  #effects = new (class {
    constructor(owner) {
      this.#owner = owner;
    }

    get owner() {
      return this.#owner;
    }
    #owner;

    get registry() {
      return this.#registry;
    }
    #registry = new Map();

    /* Returns number of registered effecs */
    get size() {
      return this.#registry.size;
    }

    /* Adds and returns effect.
    NOTE Effects are stored as keys with condition as value. */
    add = (effect, condition) => {
      condition = interpret_condition(condition);
      /* Register effect */
      this.#registry.set(effect, condition);
      /* call effect conditionally with current data */
      call_effect(effect, condition, this.owner.current, this.owner);
      /* Return effect to enable later removal */
      return effect;
    };

    has = (effect) => {
      return this.#registry.has(effect);
    };

    notify = (changes) => {
      for (const [effect, condition] of this.#registry) {
        call_effect(effect, condition, changes, this.owner);
      }
    };

    /* Removes effect. Chainable with respect to reactive. */
    remove = (effect) => {
      this.#registry.delete(effect);
      return this.owner;
    };
  })(this);

  /* . */
  get previous() {
    return this.#previous;
  }
  #previous = {};

  update(updates = {}) {
    const changes = Object.fromEntries(
      Object.entries(updates)
        .map(([key, value]) => [
          key,
          typeof value === "function" ? value.call(this) : value,
        ])

        .filter(
          ([key, value]) => value !== undefined && this.#current[key] !== value
        )
    );
    this.#previous = { ...this.#current };

    Object.entries(changes).forEach((key, value) => {
      if (key === null) {
        delete this.#current[key];
      } else {
        this.#current[key] = value;
      }
    });

    this.effects.notify(changes);

    return this;
  }
}

function interpret_condition(condition) {
  if (condition === undefined) return;
  if (typeof condition === "function") return condition;
  if (typeof condition === "string") {
    /* Create condition function from string short-hand:
    data must contain a key corresponding to the string short-hand. */
    const key = condition;
    condition = (data) => key in data;
  } else if (Array.isArray(condition)) {
    /* Create condition function from array short-hand:
    data must contain a key that is present in the array short-hand. */
    const keys = condition;
    condition = (data) => {
      for (const key of keys) {
        if (key in data) {
          return true;
        }
      }
      return false;
    };
  } else {
    /* By usage convention, assume single item plain object of the form: 
    {<required key>: <required current value>} */
    const key = Object.keys(condition)[0];
    const value = Object.values(condition)[0];
    condition = (data) => key in data && data[key].current === value;
  }
  return condition;
}

function call_effect(effect, condition, ...args) {
  if (condition) {
    if (condition(...args)) {
      effect(...args);
    } else {
      return false;
    }
  } else {
    effect(...args);
  }
  return true;
}
