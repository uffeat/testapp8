/* . */
export class List extends Array {
  static create = (...args) => {
    return new List(...args);
  };

  constructor(...items) {
    super();
    this.push(...items);
  }

  get size() {
    return this.length;
  }

  append(...items) {
    this.push(...items);
    return this;
  }

  has(item) {
    return this.includes(item);
  }

  remove(item) {
    const index = this.indexOf(item);
    if (index !== -1) {
      this.splice(index, 1);
    }
    return this;
  }

  reset(value) {
    if (value === undefined) {
      this.length = 0
    } else {
      for (let i = 0; i < this.length; i++) {
        this[i] = value
      }
    }
    return this;
  }

  transform(f) {
    for (let i = 0; i < this.length; i++) {
      this[i] = f(this[i], i, this)
    }
    return this;
  }
}
