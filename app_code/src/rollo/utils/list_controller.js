/* Controller for array and array-like objects. 
Provides enhanced chainable methods, notably 'remove'. */
export class ListController {
  static create = (...args) => {
    return new ListController(...args);
  };

  constructor(source) {
    if (source) {
      if (
        ["filter", "forEach", "indexOf", "map", "push", "splice"].some(
          (method) => typeof source[method] !== "function"
        )
      ) {
        throw new Error(`'source' should be an array or an array-like object.`);
      }
      this.#source = source;
    }
  }

  get size() {
    return this.source.length;
  }

  get source() {
    return this.#source
  }
  #source = [];

  append(item) {
    this.source.push(item);
    return this;
  }

  for_earch(f) {
    this.source.forEach(f);
    return this;
  }

  remove(item) {
    const index = this.source.indexOf(item);
    if (index !== -1) {
      this.source.splice(index, 1);
    }
    return this;
  }
}
