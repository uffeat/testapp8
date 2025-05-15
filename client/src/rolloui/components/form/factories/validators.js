/* 

*/

export const validators = (parent, config, ...factories) => {
  return class extends parent {
    static name = "validators";

    #validators;

    constructor() {
      super();
      this.#validators = new Validators(this);
    }

    /* Returns 'validators' controller. */
    get validators() {
      return this.#validators;
    }
  };
};

class Validators {
  #owner;
  #registry = new Set();

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns number of registed validators. */
  get size() {
    return this.#registry.size;
  }

  /* Returns registed validators. */
  get validators() {
    return this.#registry.values();
  }

  /* Adds and returns validator.
  NOTE
  - Validators should return validation message, if invalid and falsy value, 
  if valid. */
  add(validator) {
    this.#registry.add(validator);
    return validator;
  }

  /* Tests, if validator registed. */
  has(validator) {
    return this.#registry.has(validator);
  }

  /* Removes validator. */
  remove(validator) {
    this.#registry.delete(validator);
  }

  /* Returns validation message, if invalid. Returns false, if valid. */
  validate() {
    let index = 0;
    for (const validator of this.#registry.values()) {
      const message = validator.call(
        this.#owner,
        this.#owner,
        Object.freeze({
          index: ++index,
          self: validator,
        })
      );
      if (message) return message;
    }
    return false;
  }
}
