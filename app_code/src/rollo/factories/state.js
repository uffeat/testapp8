/* Factory for light-weight and flexible conditional pub-sub-based reactivity 
based on flat object data.
Can also be used stand-alone. */
export const state = (parent, config, ...factories) => {
  const cls = class State extends parent {
    constructor(owner) {
      super();
      this.#owner = owner;
    }

    /* Provives API for getting/setting single state items. */
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

    /* Returns current state data.
    NOTE 
    - Mutations escape effects and should generally be avoided. */
    get current() {
      return this.#current;
    }
    #current = {};

    /* Returns controller for managing effects. */
    get effects() {
      return this.#effects;
    }
    #effects = new Effects(this);

    /* Returns owner. */
    get owner() {
      return this.#owner;
    }
    #owner;

    /* Returns state data as-was before mosrt recent change.
    NOTE 
    - Can, but should generally not, be mutated. */
    get previous() {
      return this.#previous;
    }
    #previous = {};

    /* Updates state data and notifies effects if changes. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);
      /* Infer changed items */
      const changes = Object.fromEntries(
        Object.entries(updates)
          .map(([key, value]) => [
            key,
            typeof value === "function" ? value.call(this) : value,
          ])
          .filter(
            ([key, value]) =>
              value !== undefined && this.#current[key] !== value
          )
      );
      /* Infer changed items as they were before change */
      const previous = Object.fromEntries(
        Object.entries(changes).map(([key, value]) => [key, this.#current[key]])
      );
      /* Update storage */
      this.#previous = { ...this.#current };
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null) {
          delete this.#current[key];
        } else {
          this.#current[key] = value;
        }
      });
      /* Notify effects */
      if (Object.keys(changes).length) {
        this.effects.notify(changes, previous);
      }

      return this;
    }
  };
  return cls;
};


/* Effects controller. Composition class for State. */
class Effects {
  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns any owner. */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns effects registry.
  NOTE
  - Can, but should generally not, be mutated outside the Effects class. */
  get registry() {
    return this.#registry;
  }
  #registry = new Map();

  /* Returns number of registered effecs. */
  get size() {
    return this.#registry.size;
  }

  /* Adds and returns effect.
  NOTE 
  - Effects are stored as keys with condition as value. */
  add = (effect, condition) => {
    if (condition !== undefined && typeof condition !== "function") {
      condition = interpret_condition(condition);
    }

    /* Register effect */
    this.#registry.set(effect, condition);
    /* call effect conditionally with full data */
    call_effect(
      effect,
      condition,
      { ...this.owner.current },
      { ...this.owner.previous }
    );
    /* Return effect to enable later removal */
    return effect;
  };

  /* Tests, if effect is in registry. */
  has = (effect) => {
    return this.#registry.has(effect);
  };

  /* Calls effects.
  NOTE
  - Can, but should generally not, be called outside the State class. */
  notify = (...args) => {
    for (const [effect, condition] of this.#registry) {
      call_effect(effect, condition, ...args);
    }
  };

  /* Removes effect. Chainable with respect to reactive. */
  remove = (effect) => {
    this.#registry.delete(effect);
    return this.owner;
  };
}

/* Creates and return condition function from short-hand. */
function interpret_condition(condition) {
  if (typeof condition === "string") {
    /* Create condition function from string short-hand:
    changes must contain a key corresponding to the string short-hand. */
    const key = condition;
    condition = (changes) => key in changes;
  } else if (Array.isArray(condition)) {
    /* Create condition function from array short-hand:
    changes must contain a key that is present in the array short-hand. */
    const keys = condition;
    condition = (changes) => {
      for (const key of keys) {
        if (key in changes) {
          return true;
        }
      }
      return false;
    };
  } else if (
    typeof condition === "object" &&
    Object.keys(condition).length === 1
  ) {
    /* Create condition function from single-item object short-hand:
    changes must contain a key-value pair corresponding to the object short-hand. */
    const key = Object.keys(condition)[0];
    const value = Object.values(condition)[0];
    condition = (changes) => changes[key] === value;
  } else {
    throw new Error(`Invalid condition: ${condition}`);
  }
  return condition;
}

/* Call effects as per any condition.
NOTE
- Conditions can be used as:
  - Switches for calling/not calling the effect.
  - Pre-processors for arg passed onto effect.
  - ... A combination of the above.
- Effects can, but should generally not, mutate data passed into them.
- Effects can be async. */
function call_effect(effect, condition, ...args) {
  if (condition) {
    const result = condition(...args);
    if ([true, undefined].includes(result)) {
      /* Call effect with original args */
      effect(...args);
    } else if ([false, null].includes(result)) {
      /* Do NOT call effect */
      return false;
    } else {
      /* Call effect with result as arg */
      effect(result);
    }
  } else {
    /* Call effect with original args */
    effect(...args);
  }
  return true;
}
