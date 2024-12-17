/* Object extension with concise syntax and enhanced features, incl. Array-like 
and Python dict-inspired methods. Use as an alternative to plain objects, 
especially when 
- batch updates, and/or
- in-place mutations
are required.
*/
export class Data extends Object {
  static create = (...args) => {
    return new Data(...args);
  };

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

  /* Returns clone of the Data instance. */
  clone() {
    return Data.create(this.entries);
  }

  /* Returns Data instance with entries filtered according to provided function. */
  filter(f) {
    return Data.create(this.entries.filter(f));
  }

  /* Executes provided function with items successively passed in. Chainable. */
  forEach(f) {
    /* NOTE use:
      [...this.entries]
    so that 'foreach' can be used to safely mutate object.
     */
    [...this.entries].forEach(f);
    return this;
  }

  /* Returns Data instance with entries mapped according to provided function. */
  map(f) {
    return Data.create(this.entries.map(f));
  }

  /* Deletes item by key and return value of deleted item. */
  pop(key) {
    const value = this[key];
    delete this[k];
    return value;
  }

  /* Removes all items or sets all items to a provided value. Chainable. */
  reset(value) {
    return this.update(this.map(([k, v]) => [k, value]));
  }

  /* Mutates according to provided function. Chainable.
  NOTE Mutating version of 'map'. */
  transform(f) {
    return this.update(this.map(f));
  }

  /* Updates items from provided object. Items with undefined values are deleted. 
  Chainable. */
  update(updates) {
    if (updates) {
      /* Allow updates as entries array */
      if (Array.isArray(updates)) {
        updates = Object.fromEntries(updates);
      }
      for (const [k, v] of Object.entries(updates)) {
        if (k in Data.prototype) {
          throw new Error(`Reserved key: ${k}`);
        }
        if (v === undefined) {
          delete this[k];
        } else {
          this[k] = v;
        }
      }
    }
    return this;
  }
}