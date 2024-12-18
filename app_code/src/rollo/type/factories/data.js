/* Factory for enhancing plain object features, notably:
- Batch updating.
- Conditional mutation with (chainable) methods that resemble 
  (mutating versions of) array methods.
- Properties that reduce the need for using static Object methods. */
export const data = (parent, config, ...factories) => {
  const cls = class Data extends parent {
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

    /* Deletes all items with undefined values. Chainable. */
    clean() {
      this.forEach(([k, v]) => {
        if (v === undefined) {
          delete this[k];
        }
      });
      return this;
    }

    /* Deletes all items. Chainable. */
    clear() {
      this.forEach(([k, v]) => delete this[k]);
      return this;
    }

    /* Deletes items as per provided function. */
    filter(f) {
      this.forEach(([k, v]) => {
        if (!f([k, v])) {
          delete this[k];
        }
      });
      return this;
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

    /* Deletes item by key and returns value of deleted item. */
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

    /* Mutates items as per provided function. Chainable. */
    transform(f) {
      const updates = this.entries.map(f);
      return this.update(updates);
    }

    /* Updates items from provided object. Chainable. */
    update(updates) {
      super.update && super.update(updates);
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
