export class Handler {
  constructor({ condition, owner, source, transformer }) {
    this.#condition = condition;
    this.#owner = owner;
    this.#source = source;
    this.#transformer = transformer;
  }

  /* TODO
    - handler owner?
    */

  /* Returns condition. */
  get condition() {
    return this.#condition;
  }
  #condition;

  /* Returns source. */
  get source() {
    return this.#source;
  }
  #source;

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns transformer. */
  get transformer() {
    return this.#transformer;
  }
  #transformer;

  call(effect) {
    if (this.condition) {
      if (!this.condition(effect)) {
        return;
      }
    }
    if (this.transformer) {
      effect = this.transformer(effect);
    }
    this.source(effect);
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
