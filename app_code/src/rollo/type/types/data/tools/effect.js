import { type } from "rollo/type/type";

export class Effect {
  static create = (...args) => {
    const instance = new Effect(...args);
    return instance;
  };
  #source;

  constructor(source, condition) {
    this.#source = source;
    this.condition = condition;
  }

  get condition() {
    return this.#condition;
  }
  set condition(condition) {
    if (condition && typeof condition !== "function") {
      condition = interpret(condition);
    }
    this.#condition = condition;
  }
  #condition;

  get disabled() {
    return this.#disabled;
  }
  set disabled(disabled) {
    this.#disabled = disabled;
  }
  #disabled;



  call({ current, previous, publisher, session }) {
    if (this.disabled) {
      return
    }
    current = type.create("data", current);
    previous = type.create("data", previous || {});
    if (this.condition && !this.condition({ current, previous, publisher, session })) {
      return
    }
    this.#source({ current, previous, publisher, session });


    
  }
}

/* Creates and returns condition function from short-hand. */
function interpret(condition) {
  /* Create condition function from string short-hand */
  if (typeof condition === "string") {
    /* current must contain a key corresponding to the string short-hand. */
    return ({ current }) => condition in current;
  }

  if (Array.isArray(condition)) {
    /* Create condition function from array short-hand:
    current must contain a key that is present in the array short-hand. */
    return ({ current }) => {
      for (const key of condition) {
        if (key in current) return true;
      }
      return false;
    };
  }

  if (typeof condition === "object" && Object.keys(condition).length === 1) {
    /* Create condition function from single-item object short-hand:
    current must contain a key-value pair corresponding to the object short-hand. */

    /* TODO
    - use data methods
    */

    const key = Object.keys(condition)[0];
    const value = Object.values(condition)[0];
    return ({ current }) => current[key] === value;
  }

  throw new Error(`Invalid condition: ${condition}`);
}