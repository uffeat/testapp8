/* Factory for all web components. */
export const reactive = (parent, config, ...factories) => {
  const cls = class Reactive extends parent {
    /* Alternative constructor without 'new' */
    static create = (...args) => {
      return new Reactive(...args);
    };
    constructor(...args) {
      super(...args);
    }

    /* NOTE
    The actual functionality is provided by #state.
    The job of other class members is to provide an elegant API around #state.
    */

    /* Returns controller for managing effects. */
    get effects() {
      return this.#effects;
    }
    #effects = new (class {
      #owner;

      constructor(owner) {
        this.#owner = owner;
      }

      /* Returns number of registered effecs */
      get size() {
        return this.#owner.#state.effects_size;
      }

      /* Adds and returns effect.
      NOTE Effects are stored as keys with condition as value. */
      add = (effect, condition) => {
        return this.#owner.#state.add_effect(effect, condition);
      };

      /* Removes all effects. Use with caution. Chainable with respect to 
      reactive. */
      clear = () => {
        this.#owner.#state.clear_effects();
        return this.#owner;
      };

      /* Tests, if effect is registered. */
      has = (effect) => {
        return this.#owner.#state.has_effect(effect);
      };

      /* Removes effect. Chainable with respect to reactive. */
      remove = (effect) => {
        this.#owner.#state.remove_effect(effect);
        return this.#owner;
      };
    })(this);

    /* Returns an object, from which individual state items can be retrieved and 
    set reactively. */
    get $() {
      return this.#$;
    }
    #$ = new Proxy(this, {
      get: (target, key) => {
        return target.#state.current[key];
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

    /* Returns controller for certain oprations re underlying state data. */
    get data() {
      return this.#data
    }
    #data = new (class {
      #owner;

      constructor(owner) {
        this.#owner = owner;
      }

      get current() {
        return Object.freeze({ ...this.#owner.#state.current })

      }

      get previous() {
        return Object.freeze({ ...this.#owner.#state.previous })
      }

      /* Clears state data without publication. Use with caution. Chainable. */
      clear = () => {
        this.#owner.#state.clear_data();
        return this;
      };
    })(this);

    /* Provides core functionality. */
    #state = new (class State {
      /* Helper for conditionally calling effect function. */
      static #call_effect = (effect, condition, ...args) => {
        if (!condition || condition(...args)) {
          effect(...args);
        }
      };
      /* Returns condition, potentially created from short-hand. */
      static #interpret_condition = (condition) => {
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
      #current = {};
      #effects_registry = new Map();
      #owner;
      #previous = {};
      #protected_registry = {};

      constructor(owner) {
        this.#owner = owner;
      }

      get current() {
        return this.#current;
      }

      get effects_size() {
        return this.#effects_registry.size;
      }

      get previous() {
        return this.#previous;
      }

      add_effect = (effect, condition) => {
        condition = State.#interpret_condition(condition);
        /* Register effect */
        this.#effects_registry.set(effect, condition);
        /* Call effect by passing in arg based on the full underlying data and 
        using the same stucture as when the effect is called reactively */
        State.#call_effect(
          effect,
          condition,
          this.#create_effect_data(...Object.keys(this.#current)),
          this.#owner
        );
        /* Return effect, so that effects added with function expressions
        can be removed later */
        return effect;
      };

      /* Removes all effects. Use with caution.. */
      clear_effects = () => {
        this.#effects_registry = new Map();
      };

      /* Tests, if effect is registered. */
      has_effect = (effect) => {
        return this.#effects_registry.has(effect);
      };

      /* Removes effect.  */
      remove_effect = (effect) => {
        this.#effects_registry.delete(effect);
      };

      protect = (key, value) => {
        if (key in this.#protected_registry) {
          throw new Error(`'${key}' is protected.`);
        }
        const setter = (value) => {
          if (!this.#is_equal(value, this.#current[key])) {
            this.#update_stores({ [key]: value });
            this.#notify(this.#create_effect_data(key), this.#owner);
          }
        };
        this.#protected_registry = setter;
        if (value !== undefined) {
          setter(value);
        }
        return setter;
      };

      /* Resets protection registry. Use with caution; risk of memory leaks! */
      clear_protected = () => {
        this.#protected_registry = {};
      };

      is_protected = (key) => {
        return key in this.#protected_registry;
      };

      unprotect = (setter) => {
        for (const [key, value] of Object.entries({
          ...this.#protected_registry,
        })) {
          if (value === setter) {
            delete this.#protected_registry[key];
            return;
          }
        }
        throw new Error(`Invalid setter.`);
      };

      /* Clears state data without publication. Use with caution. */
      clear_data = () => {
        this.#previous = this.#current;
        this.#current = {};
      };

      /* Clears state data without publication, removes all effects and resets 
      protection registry. Use with caution; risk of memory leaks! */
      reset = () => {
        this.clear_data();
        this.clear_effects();
        this.clear_protected();
      };

      update_data = (data) => {
        /* Detect changes */
        const changes = this.#get_changes(data);
        /* Abort if no change */
        if (!changes) return this;
        /* Update data stores */
        this.#update_stores(changes);
        /* Call effects */
        this.#notify(
          this.#create_effect_data(...Object.keys(changes)),
          this.#owner
        );
      };

      #is_equal = (value_1, value_2) => value_1 === value_2;

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

      #get_changes = (data) => {
        const changes = {};
        for (const [key, value] of Object.entries(data)) {
          if (key in this.#protected_registry) {
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

      #update_stores = (data) => {
        this.#previous = { ...this.#current };
        for (const [key, value] of Object.entries(data)) {
          this.#current[key] = value;
        }
      };

      #notify = (...args) => {
        for (const [effect, condition] of this.#effects_registry) {
          State.#call_effect(effect, condition, ...args);
        }
      };
    })(this);

    /* Returns controller for managing protection of keys. */
    get protected() {
      return this.#protected;
    }
    #protected = new (class {
      #owner;

      constructor(owner) {
        this.#owner = owner;
      }

      add = (key, value) => {
        return this.#owner.#state.protect(key, value);
      };

      /* Resets protection registry. Use with caution; risk of memory leaks! */
      clear = () => {
        this.#owner.#state.clear_protected;
        return this.#owner;
      };

      has = (key) => {
        return this.#owner.#state.is_protected(key);
      };

      remove = (setter) => {
        this.#owner.#state.unprotect(setter);
        return this.#owner;
      };
    })(this);

    /* Updates state from data (object). Chainable.
    Convenient for updating multiple state items in one go.
    Can reduce redundant effect calls. */
    update(data) {
      this.#state.update_data(data);
      return this;
    }
  };
  return cls;
};

export const Reactive = reactive(class {});
