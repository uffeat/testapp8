import { type } from "rollo/type/type";
import { Change } from "rollo/type/types/data/tools/change";

/* Wrapper for registered effects.
NOTE
- Tightly coupled with Effects, from which it's used.
- Can also be used directly and passed into `...effects.add`.
*/
export class Effect {
  static create = (...args) => new Effect(...args);

  constructor(source, condition, tag) {
    this.source = source;
    this.condition = condition;
    this.tag = tag;
  }

  /* Returns condition. */
  get condition() {
    return this.#condition;
  }
  /* Sets condition. 
  NOTE
  - 'condition' can be changed dynamically, i.e., after effect registration.
    While this can be powerful, it can also add complexity!
  */
  set condition(condition) {
    if (condition && typeof condition !== "function") {
      condition = interpret(condition);
    }
    this.#condition = condition;
  }
  #condition;

  /* Returns disabled state. */
  get disabled() {
    return this.#disabled;
  }
  /* Sets disabled state.
  NOTE
  - Turns the effect on/off (regardless of condition).
  */
  set disabled(disabled) {
    this.#disabled = disabled;
  }
  #disabled;

  /* Returns source. */
  get source() {
    return this.#source;
  }
  /* Sets source. 
  NOTE
  - 'source' can be changed dynamically, i.e., after effect registration.
    While this can be powerful, it can also add complexity!
  */
  set source(source) {
    this.#source = source;
  }
  #source;

  /* Returns tag. */
  get tag() {
    return this.#tag;
  }
  /* Sets tag. 
  NOTE
  - General purpose property for providing additional information */
  set tag(tag) {
    this.#tag = tag;
  }
  #tag;

  /* Calls effect.
  NOTE
  - Can, but should generally not, be called externally. 
  */
  call({ current, index, previous, publisher, session }) {
    /* Check disabled */
    if (this.disabled) {
      return;
    }
    /* Check source */
    if (!this.source) {
      return;
    }

    /* Create argument */
    const change = Change.create({
      current,
      effect: this,
      index,
      previous,
      publisher,
      session,
    });
    /* Check condition */
    if (this.condition && !this.condition(change)) {
      return;
    }
    /* Call source and return result.
    NOTE
    - 'source' should generally not return anything explicitly. However,
      for special cases, if 'source' returns false, subsequent effects in
      the session are not called; similar to `event.stopPropagation()`.
    */
    return this.source(change);
  }

  /* Registers effect. Chainable.
  NOTE
  - Alternative to registering effect from publisher.
  */
  register(publisher) {
    publisher.effects.add(this);
    /* Call effect */
    this.call({
      current: publisher[publisher.__class__.reactive],
      index: null,
      previous: null,
      publisher: publisher,
      session: null,
    });
    return this;
  }

  /* Deregisters effect. Chainable.
  NOTE
  - Alternative to deregistering effect from publisher.
  */
  deregister(publisher) {
    publisher.effects.remove(this);
    return this;
  }
}

/* Creates and returns condition function from short-hand. */
function interpret(condition) {
  if (typeof condition === "string") {
    /* Create condition function from string short-hand:
    current must contain a key corresponding to the string short-hand. */
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
    return ({ current }) =>
      type.create("data", { ...current }).includes(condition);
  }

  throw new Error(`Invalid condition: ${condition}`);
}
