import { assign } from "rollo/utils/assign";
import { type } from "rollo/type/type";

/* . */
export const data = (parent, config, ...factories) => {
  const cls = class Data extends parent {
    constructor(updates) {
      super();
      if (updates) {
        this.update(updates);
      }
    }

    /* Returns entries. */
    get entries() {
      return Object.entries(this);
    }

    /* Returns keys. */
    get keys() {
      return Object.keys(this);
    }

    /* Returns length of keys. */
    get size() {
      return Object.keys(this).length;
    }

    /* Returns values. */
    get values() {
      return Object.values(this);
    }

    /* Deletes all items */
    clear() {
      this.forEach(([k, v]) => delete this[k]);
    }

    /* . */
    filter(f) {
      const updates = this.entries.filter(f);
      return this.update(updates);
    }

    /* Executes provided function with items successively passed in. Chainable. */
    forEach(f) {
      /* NOTE use:
        [...this.entries]
      so that 'forEach' can be used to safely mutate object.
       */
      [...this.entries].forEach(f);
      return this;
    }

    /* Freezes object shallowly. Chainable. */
    freeze() {
      return Object.freeze(this);
    }

    /* Deletes item by key and return value of deleted item. */
    pop(key) {
      const value = this[key];
      delete this[k];
      return value;
    }

    /* Sets all items to a provided value. Chainable. */
    reset(value) {
      const updates = this.entries.map(([k, v]) => [k, value]);
      return this.update(updates);
    }

    /* Mutates according to provided function. Chainable. */
    transform(f) {
      const updates = this.entries.map(f);

      return this.update(updates);
    }

    /* Updates items from provided object. Chainable. */
    update(updates) {
      if (updates) {
        /* Allow updates as entries array */
        if (Array.isArray(updates)) {
          updates = Object.fromEntries(updates);
        }
        for (const [k, v] of Object.entries(updates)) {
          
          this[k] = v;
        }
      }
      return this;
    }
  };
  return cls;
};

const Data = type.author("data", Object, {}, data);



assign(Data.prototype, (class {
  clone() {
    return type.create('data', this.entries)
  }
}).prototype)

type.registry.add('data', Data)

