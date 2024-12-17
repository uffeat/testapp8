import { Data } from "rollo/types/data";

/* Factory for light-weight and flexible conditional pub-sub-based reactivity 
based on flat object data.
Can also be used stand-alone. */
export const state = (parent, config, ...factories) => {
  const cls = class State extends parent {
    static create = (...args) => {
      return new State(...args);
    };
    constructor(owner) {
      super();
      this.#owner = owner;
    }

    /* Provives API for getting/setting single state items. */
    get $() {
      return this.#$;
    }
    #$ = new Proxy(this, {
      get: (target, k) => {
        return target.#current[k];
      },
      set: (target, k, v) => {
        target.update({ [k]: v });
        return true;
      },
    });

    /* Returns current state data.
    NOTE 
    - Mutations escape effects and should generally be avoided. */
    get current() {
      return this.#current;
    }
    #current = Data.create();

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

    /* Returns state data as-was before most recent change.
    NOTE 
    - Can, but should generally not, be mutated. */
    get previous() {
      return this.#previous;
    }
    #previous = Data.create();

    /* Filters state reactively as per provided function. Chainable. */
    filter(f) {
      
      return this.update(this.#current.map(([k, v]) =>
        f([k, v]) ? [k, v] : [k, undefined]
      ));
    }

    /* Resets all items reactively to provided value. Chainable. */
    reset(value) {
      return this.update(this.#current.map(([k, v]) => [k, value]));
    }

    /* Transforms all items reactively as per provided function. Chainable. */
    transform(f) {
      return this.update(this.#current.map(f));
    }

    /* Updates state data and notifies effects if changes. Chainable. */
    update(updates) {
      super.update && super.update(updates);
      updates = Data.create(updates);
      /* Infer changed items */
      const changes = updates.filter(([k, v]) => this.#current[k] !== v);
      /* Infer changed items as they were before change */
      const previous = changes.map(([k, v]) => [k, this.#current[k]]);
      /* Update storage */
      changes.forEach(([k, v]) => {
        this.#previous[k] = this.#current[k];
        /* NOTE undefined deletes */
        if (v === undefined) {
          delete this.#current[k];
        } else {
          this.#current[k] = v;
        }
      });
      /* Notify effects */
      if (changes.size) {
        this.effects.notify(changes, previous, this.owner || this);
      }
      return this.owner || this;
    }
  };

  return cls;
};

export const State = state(class {});

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

  /* Registers, calls and returns effect.
  NOTE 
  - Effects are stored as keys with condition as values. */
  add(effect, condition) {
    if (condition !== undefined && typeof condition !== "function") {
      condition = interpret_condition(condition);
    }
    /* Register effect */
    this.#registry.set(effect, condition);
    /* Call effect conditionally with full data */
    call_effect(
      effect,
      condition,
      Data.create(this.owner.current),
      Data.create(this.owner.previous),
      this.owner.owner || this.owner
    );
    /* Return effect to enable later removal */
    return effect;
  }

  /* Tests, if effect is in registry. */
  has(effect) {
    return this.#registry.has(effect);
  }

  /* Calls effects.
  NOTE
  - Can, but should generally not, be called outside the State class. */
  notify(...args) {
    for (const [effect, condition] of this.#registry) {
      call_effect(effect, condition, ...args);
    }
  }

  /* Removes effect. Chainable with respect to owner. */
  remove(effect) {
    this.#registry.delete(effect);
    return this.owner;
  }
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
