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
  #effect_registry = new Map();
  #effect_controller;
  #name;
  #owner;
  #previous = {};
  #protected;

  constructor(state, { name, owner } = {}) {
    this.#name = name;
    this.#owner = owner;
    if (state) {
      this.#update_stores(state);
    }

    const reactive = this;

    this.#protected = new (class Protected {
      #registry = {};

      add = (key, value) => {
        const set = (value) => {
          if (!reactive.#is_equal(value, reactive.#current[key])) {
            reactive.#update_stores({ [key]: value });
            reactive.#notify(reactive.#create_effect_data(key), this);
          }
        };
        this.#registry[key] = set;
        if (value !== undefined) {
          set(value);
        }
        return set;
      };

      clear = () => {
        this.#registry[key] = {};
      };

      has = (key) => {
        return key in this.#registry;
      };
    })();

    /* Storage util for, potentially conditional, effect functions. */
    this.#effect_controller = new (class EffectController {
      /* Returns number of registered effecs */
      get size() {
        return reactive.#effect_registry.size;
      }

      /* Adds and returns effect.
      NOTE Effects are stored as keys with condition as value. */
      add = (effect, condition) => {
        condition = this.#interpret_condition(condition);
        /* Register effect */
        reactive.#effect_registry.set(effect, condition);
        /* Call effect by passing in arg based on the full underlying data and 
        using the same stucture as when the effect is called reactively */
        Reactive.#call_effect(
          effect,
          condition,
          reactive.#create_effect_data(...Object.keys(reactive.#current)),
          reactive
        );
        /* Return effect, so that effects added with function expressions
        can be removed later */
        return effect;
      };

      /* Removes all effects. Use with caution. Chainable with respect to reactive. */
      clear = () => {
        this.reactive.#effect_registry = new Map();
        return reactive;
      };

      /* Tests, if effect is registered. */
      has = (effect) => {
        return reactive.#effect_registry.has(effect);
      };

      /* Removes effect. Chainable with respect to reactive. */
      remove = (effect) => {
        reactive.#effect_registry.delete(effect);
        return reactive;
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
    })();
  }

  /* Returns controller for managing effects. */
  get effects() {
    return this.#effect_controller;
  }

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
      return this.#current[key];
    },
    set: (target, key, value) => {
      /* Handle function value */
      if (typeof value === "function") {
        value = value.call(this);
      }
      this.update({ [key]: value });
      return true;
    },
  });

  /* Clears state data without publication. Use with caution. Chainable. */
  clear = () => {
    this.#previous = this.#current;
    this.#current = {};
    this.protected.clear();
    return this;
  };

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

  /* Updates state from data (object). Chainable.
  Convenient for updating multiple state items in one go.
  Can reduce redundant effect calls. */
  update = (data) => {
    /* Detect changes */
    const changes = this.#get_changes(data);
    /* Abort if no change */
    if (!changes) return;
    /* Update data stores */
    this.#update_stores(changes);
    /* Call effects */
    this.#notify(this.#create_effect_data(...Object.keys(changes)), this);
    return this;
  };

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

  /* Returns Boolean result of simple equality comparison.
  NOTE Default function; may be changed by constructor arg. */
  #is_equal = (value_1, value_2) => value_1 === value_2;

  /* Publishes to effects subject to any conditions. Chainable */
  #notify = (...args) => {
    for (const [effect, condition] of this.#effect_registry) {
      Reactive.#call_effect(effect, condition, ...args);
    }
    return this;
  };

  /* Updates stores with 'data'. Chainable. */
  #update_stores = (data) => {
    this.#previous = this.#current;
    for (const [key, value] of Object.entries(data)) {
      this.#current[key] = value;
    }
    return this;
  };
}