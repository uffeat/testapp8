/*  */
export class Reactive {
  static create = (state, { name, owner } = {}) => {
    return new Reactive(state, { name, owner });
  };
  /* Helper for conditionally calling effect function. */
  static #call_effect = (effect, condition, ...args) => {
    if (!condition || condition(...args)) {
      effect(...args);
    }
  };
  #current = {};
  /* Create registry for effect functions:
  Stored as keys with any condition as value. */
  #effects_registry = new Map();
  #name;
  #owner;
  #previous = {};

  constructor(state, { name, owner } = {}) {
    this.#name = name;
    this.#owner = owner;
    if (state) {
      this.#update_stores(state);
    }
  }

  /* Returns controller for managing effects. */
  get effects() {
    return this.#effects;
  }
  /* Storage util for, potentially conditional, effect functions. */
  #effects = new (class {
    #owner;

    constructor(owner) {
      this.#owner = owner;
    }

    /* Returns number of registered effecs */
    get size() {
      return this.#owner.#effects_registry.size;
    }

    /* Adds and returns effect.
    NOTE Effects are stored as keys with condition as value. */
    add = (effect, condition) => {
      condition = this.#interpret_condition(condition);
      /* Register effect */
      this.#owner.#effects_registry.set(effect, condition);
      /* Call effect by passing in arg based on the full underlying data and 
      using the same stucture as when the effect is called reactively */
      Reactive.#call_effect(
        effect,
        condition,
        this.#owner.#create_effect_data(...Object.keys(this.#owner.#current)),
        this.#owner
      );
      /* Return effect, so that effects added with function expressions
      can be removed later */
      return effect;
    };

    /* Removes all effects. Use with caution. Chainable with respect to reactive. */
    clear = () => {
      this.#owner.#effects_registry = new Map();
      return this.#owner;
    };

    /* Tests, if effect is registered. */
    has = (effect) => {
      return this.#owner.#effects_registry.has(effect);
    };

    /* Removes effect. Chainable with respect to reactive. */
    remove = (effect) => {
      this.#owner.#effects_registry.delete(effect);
      return this.#owner;
    };

    /* Returns condition, potentially created from short-hand. */
    #interpret_condition = (condition) => {
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
    };
  })(this);

  /* Returns name, primarily for optional soft identification. */
  get name() {
    return this.#name;
  }

  /* Returns owner.
  NOTE The owner feature is provided for potential use in extension of or
  compositions with Reactive. */
  get owner() {
    return this.#owner;
  }

  /* Returns object,from which individual state items can be retrieved and set 
  reactively. */
  get $() {
    return this.#$;
  }
  #$ = new Proxy(this, {
    get: (target, key) => {
      return target.#current[key];
    },
    set: (target, key, value) => {
      /* Handle function value */
      if (typeof value === "function") {
        value = value.call(target);
      }
      target.update({ [key]: value });
      return true;
    },
  });

  /* Returns a shallowly frozen shallow copy of underlying state data as it was 
  before the most recent change. */
  get previous() {
    return Object.freeze({ ...this.#previous });
  }

  /* Returns a shallowly frozen shallow copy of underlying state data. */
  get current() {
    return Object.freeze({ ...this.#current });
  }

  get protected() {
    return this.#protected;
  }
  #protected = new (class {
    #owner;
    /* Create registry for protected keys:
    Keys are keys, values are setters. */
    #registry = {};

    constructor(owner) {
      this.#owner = owner;
    }

    add = (key, value) => {
      if (this.has(key)) {
        throw new Error(`'${key}' is protected.`);
      }
      const setter = (value) => {
        if (!this.#owner.#is_equal(value, this.#owner.#current[key])) {
          this.#owner.#update_stores({ [key]: value });
          this.#owner.#notify(this.#owner.#create_effect_data(key), this);
        }
      };
      this.#registry[key] = setter;
      if (value !== undefined) {
        setter(value);
      }
      return setter;
    };

    /* Resets protection registry. Use with caution; risk of memory leaks! */
    clear = () => {
      this.#registry = {}
    }

    has = (key) => {
      return key in this.#registry;
    };

    remove = (setter) => {
      for (const [key, value] of Object.entries({ ...this.#registry })) {
        if (value === setter) {
          delete this.#registry[key];
          return;
        }
      }
      throw new Error(`Invalid setter.`);
    };
  })(this);

  /* Clears state data without publication. Use with caution. Chainable. */
  clear() {
    this.#previous = this.#current;
    this.#current = {};
    return this;
  }

  /* Clears state data without publication, removes all effects and resets 
  protection registry. Use with caution; risk of memory leaks! Chainable */
  reset() {
    this.clear();
    this.effects.clear();
    this.protected.clear();
    return this;
  }

  /* Updates state from data (object). Chainable.
  Convenient for updating multiple state items in one go.
  Can reduce redundant effect calls. */
  update(data) {
    /* Detect changes */
    const changes = this.#get_changes(data);
    /* Abort if no change */
    if (!changes) return;
    /* Update data stores */
    this.#update_stores(changes);
    /* Call effects */
    this.#notify(this.#create_effect_data(...Object.keys(changes)), this);
    return this;
  }

  /* Creates and returns object of the form
  { <key>: { current: <current value>, previous: <previous value> }, <key>: ... }
  to be passed into effects/conditions. */
  #create_effect_data = (...keys) => {
    const data = {};
    for (const key of keys) {
      data[key] = {
        current: this.#current[key],
        previous: this.#previous[key],
      };
    }
    Object.freeze(data);
    return data;
  };

  /* Compares current with 'data'. Returns null, if all items in 'data' 
  are present in current; otherwise, an object with 'data' items that are 
  different from current is returned. */
  #get_changes = (data) => {
    const changes = {};
    for (const [key, value] of Object.entries(data)) {
      if (this.protected.has(key)) {
        throw new Error(`'${key}' is protected.`);
      }
      if (
        !(key in this.#current) ||
        !this.#is_equal(value, this.#current[key])
      ) {
        changes[key] = value;
      }
    }
    return Object.keys(changes).length === 0 ? null : changes;
  };

  /* Returns Boolean result of simple equality comparison. */
  #is_equal = (value_1, value_2) => value_1 === value_2;

  /* Publishes to effects subject to any conditions. Chainable */
  #notify = (...args) => {
    for (const [effect, condition] of this.#effects_registry) {
      Reactive.#call_effect(effect, condition, ...args);
    }
    return this;
  };

  /* Updates stores with 'data'. Chainable. */
  #update_stores = (data) => {
    this.#previous = { ...this.#current };
    for (const [key, value] of Object.entries(data)) {
      this.#current[key] = value;
    }
    return this;
  };
}
