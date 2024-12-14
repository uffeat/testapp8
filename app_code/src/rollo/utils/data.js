export class Data extends Object {
  static create = (object) => {
    return new Data(object);
  };

  constructor(updates = {}) {
    super();
    this.update(updates);
  }

  get entries() {
    return [...Object.entries(this)];
  }

  get keys() {
    return [...Object.keys(this)];
  }

  get size() {
    return Object.keys(this).length;
  }

  get values() {
    return [...Object.values(this)];
  }

  clone() {
    return Data.create(Object.entries(this))
  }

  filter(f) {
    return Data.create(Object.entries(this).filter(f));
  }

  /* */
  for_each(f) {
    Object.entries(this).forEach(f);
    return this;
  }

  /* */

  /* */
  map(f) {
    return Data.create(Object.entries(this).map(f));
  }

  /* */
  reset(value) {
    return this.update(this.map(([k, v]) => [k, value]));
  }

  update(updates = {}) {
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
    return this;
  }
}
