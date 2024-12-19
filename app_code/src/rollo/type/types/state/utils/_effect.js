export class Effect {
  static create = (...args) => {
    return new Effect(...args);
  };
  constructor({ condition, source, transformer }) {
    this.update({ condition, source, transformer });
  }

  /* Returns condition. */
  get condition() {
    return this.#condition;
  }
  /* Sets condition. */
  set condition(condition) {
    if (condition && typeof condition !== "function") {
      condition = interpret_condition(condition);
    }
    this.#condition = condition;
  }
  #condition;

  /* Returns source. */
  get source() {
    return this.#source;
  }
  /* Sets source. */
  set source(source) {
    this.#source = source;
  }
  #source;

  /* Returns transformer. */
  get transformer() {
    return this.#transformer;
  }
  /* Sets transformer. */
  set transformer(transformer) {
    this.#transformer = transformer;
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

  update({ condition, source, transformer } = {}) {
    this.condition = condition;
    this.source = source;
    this.transformer = transformer;
    return this;
  }
}

/* Creates and return condition function from short-hand. */
function interpret_condition(condition) {
  if (typeof condition === "string") {
    /* Create condition function from string short-hand:
    Changes must contain a key corresponding to the string short-hand. */
    return (effect) => condition in effect.current;
  }

  if (Array.isArray(condition)) {
    /* Create condition function from array short-hand:
    Changes must contain a key that is present in the array short-hand. */
    return (effect) => {
      for (const key of condition) {
        if (key in effect.current) return true;
      }
      return false;
    };
  }

  if (typeof condition === "object" && Object.keys(condition).length === 1) {
    /* Create condition function from single-item object short-hand:
    Changes must contain a key-value pair corresponding to the object short-hand. */
    const key = Object.keys(condition)[0];
    const value = Object.values(condition)[0];
    return (effect) => effect.current[key] === value;
  }

  throw new Error(`Invalid condition: ${condition}`);
}
