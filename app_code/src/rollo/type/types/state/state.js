import "rollo/type/types/data/data";
import { type } from "rollo/type/type";
import { name } from "rollo/type/factories/name";
import { owner } from "rollo/type/factories/owner";
import { condition } from "rollo/type/types/state/factories/condition";
import { transformer } from "rollo/type/types/state/factories/transformer";
import { Message } from "rollo/type/types/state/tools/_message";
import { Effects } from "rollo/type/types/state/tools/_effects";

const Composite = type.compose(
  Object,
  {},
  condition,
  name,
  owner,
  transformer
);

/* Implementation class for the 'state' factory. */
class State extends Composite {
  static create = (update) => {
    const instance = new State().update(update);

    return new Proxy(this, {
      get: (target, key) => {
        return instance[key];
      },
      set: (target, key, value) => {
        if (key in instance.__chain__.prototypes) {
          instance[key] = value;
          return true;
        }
        instance.update({ [key]: value });
        return true;
      },
      has: (target, key) => {
        return key in target.current;
      },
    });
  };
  constructor() {
    super();
  }

  /* Returns non-defined state items.
    NOTE 
    - Can, but should generally not, be mutated. */
  get current() {
    return type
      .create("data", { ...this })
      .filter(([k, v]) => !(k in this.__chain__.defined));
  }

  /* Returns non-defined state items as-was before most recent change.
    NOTE 
    - Can, but should generally not, be mutated. */
  get previous() {
    return this.#previous;
  }
  #previous = type.create("data");

  /* Returns clone with shallow copy of current data and everything else reset. */
  clone() {
    return type.create("state", { ...this.current });
  }

  /* Updates state from provided object. Chainable. */
  update(update) {
    if (!update) return this;
    update = type.create("data", update);

    /* Infer changed items */
    const current = type.create(
      "data",
      update.filter(([k, v]) => this[k] !== v)
    );


    /* Infer changed items as they were before change */
    const previous = type.create(
      "data",
      current.entries.map(([k, v]) => [k, this.#previous[k]])
    );


    /* Update */
    current.forEach(([k, v]) => {
      this.#previous[k] = this[k];
      /* NOTE undefined deletes. This is critical for other methods! */
      if (v === undefined) {
        delete this[k];
      } else {
        this[k] = v;
      }
    });
    /* Notify effects */
    if (current.size) {
      this.effects.notify(Message.create({ current, previous, owner: this }));
    }
    return this;
  }

  /* Returns controller for managing effects. */
  get effects() {
    return this.#effects;
  }
  #effects = new Effects(this);

  /* . */
  get size() {}

  /* . */
  clean() {}

  /* . */
  clear() {}

  /* . */
  filter(f) {}

  /* . */
  forEach(f) {}

  /* . */
  pop(key) {}

  /* . */
  reset(value) {}

  /* . */
  transform(f) {}
}

type.register("state", State);
