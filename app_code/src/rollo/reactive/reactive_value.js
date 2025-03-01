//import { Reactive } from "rollo/reactive/reactive_value";

import { is_primitive } from "rollo/tools/is/is_primitive";

export const Reactive = (current, props = {}, ...effects) => {
  const self = new Type();
  Object.assign(self, props);
  effects.forEach((e) => self.effects.add(e, { run: false }));
  self.current = current;
  return self;
};

/* Light-weight reactivity util intended for primitive values.
Supports:
- Immediately run effects.
- Conditional effects.
- Conditional update, incl. condition specification from short-hands.
- Pre-update transformation. */
class Type {
  #condition = null;
  #current = null;
  #detail = {};
  #effects;
  #name = null;
  #owner = null;
  #previous = null;
  #source = null;
  #transformer = null;

  constructor() {
    this.#effects = new Effects(this);
  }

  /* Returns condition hook. */
  get condition() {
    return this.#condition;
  }
  /* Sets condition hook. */
  set condition(condition) {
    condition = interpret_condition(condition);
    this.#condition = condition;
  }

  /* Returns current value. */
  get current() {
    return this.#current;
  }
  /* Sets current value reactively. */
  set current(current) {
    if (typeof current === "function") {
      current = current.call(this, this);
    }
    this.update(current);
  }

  /* Returns detail.
  NOTE
  - Useful for managing ad-hoc data 
    (organized alternative to data props). */
  get detail() {
    return this.#detail;
  }
  set detail(detail) {
    this.#detail = detail;
  }

  /* Returns controller for effects. */
  get effects() {
    return this.#effects;
  }

  /* Returns name.
  NOTE
  - Useful for soft identification. */
  get name() {
    return this.#name;
  }
  /* Sets name. */
  set name(name) {
    this.#name = name;
  }

  /* Returns owner.
  NOTE
  - Can, e.g., be used for indirectly expading feature set;
    available from condition, transformer, source and effects. */
  get owner() {
    return this.#owner;
  }
  /* Sets owner. */
  set owner(owner) {
    this.#owner = owner;
  }

  /* Returns current value as-was before most recent change. */
  get previous() {
    return this.#previous;
  }

  /* Returns source hook. */
  get source() {
    return this.#source;
  }
  /* Sets source hook. */
  set source(source) {
    this.#source = source;
  }

  /* Returns transformer hook. */
  get transformer() {
    return this.#transformer;
  }
  /* Sets transformer hook. */
  set transformer(transformer) {
    this.#transformer = transformer;
  }

  /* Updates current value reactively subject to any condition and 
  transformation. Returns result of any source.
  NOTE
  - Effectively makes the object callable.
  - Makes it possible to use the object as
    - condition,
    - effect,
    - source, and/or
    - transformer
    in the context of another Reactive instance. */
  call(context, { current, index = null, detail = null, previous }) {
    /* NOTE
    - Dummy 'context' in signature to let instance be treated as a function. */
    const argument = {
      current,
      detail,
      index,
      owner: this,
      previous,
    };

    /* NOTE
    - 'role' explicitly instructs any condition, transformer and source.
      Useful, when the same function plays multiple roles. */

    if (this.condition) {
      if (
        !this.condition.call(
          this,
          Object.freeze({
            role: "condition",
            self: this.condition,
            ...argument,
          })
        )
      ) {
        return;
      }
    }
    if (this.transformer) {
      current = this.transformer.call(
        this,
        Object.freeze({
          role: "transformer",
          self: this.transformer,
          ...argument,
        })
      );
    }
    let result;
    if (this.source) {
      result = this.source.call(
        this,
        Object.freeze({
          role: "source",
          self: this.source,
          ...argument,
        })
      );
    }
    if (!this.match(current)) {
      this.#previous = this.#current;
      this.#current = current;

      if (this.effects.size()) {
        this.effects.notify({
          current: this.#current,
          previous: this.#previous,
        });
      }
    }
    return result;
  }

  /* Checks is, other is "equal" to current. 
  NOTE
  - Provided as a method to facilitate overloading. */
  match(other) {
    return other === this.#current;
  }

  /* Updates current value reactively subject to any condition and 
  transformation. Chainable. */
  update(current) {
    if (current instanceof Type) {
      current = current.current;
    }
    this.call(null, { current });
    return this;
  }
}

/* Controller for managing effects. */
class Effects {
  #owner;
  #registry = new Map();

  constructor(owner) {
    this.#owner = owner;
  }

   /* Adds and returns effect. Option (default) to run effect immediately. 
   NOTE
   - Effect is stored with an optional 'detail'; can be useful for e.g., 
     effect retrieval and/or special instructions to effect, when called. */
  add(effect, { detail = null, run = true } = {}) {
    this.#registry.set(effect, detail);
    if (run) {
      effect.call(this.#owner, {
        current: this.#owner.current,
        detail,
        index: null,
        owner: this.#owner,
        previous: this.#owner.previous,
        role: "effect",
        self: effect,
      });
    }
    /* Return effect for, e.g., later removal */
    return effect;
  }

  /* Test, if effect added. */
  has(effect) {
    return this.#registry.has(effect);
  }

  /* Returns registered entry by test function. 
  NOTE
  - Returns first effect that satisfies test function. */
  find(test) {
    return Array.from(this.#registry.entries()).find(test);
  }

  /* Returns registered effect by detail.
  NOTE
  - Returns first effect that matches detail. */
  get(detail) {
    for (const [effect, _detail] of this.#registry.entries()) {
      if (detail === _detail) {
        return effect
      }
    }
    return null
  }

  /* Calls effects. Chainable
  NOTE
  - Can, but should typically not, be called externatlly. */
  notify({ current, previous }) {
    const argument = {
      current,
      owner: this.#owner,
      previous,
      role: "effect",
    };
    this.#registry.entries().forEach(([effect, detail], index) => {
      effect.call(
        this.#owner,
        Object.freeze({
          index,
          detail,
          self: effect,
          ...argument,
        })
      );
    });
    return this;
  }

  /* Removes effect. Chainable. */
  remove(effect) {
    this.#registry.delete(effect);
    return this;
  }

  /* Returns number of effects. 
  NOTE
  - Implemented as a method (rather than an accessor prop), so that overloaded 
    versions may provide args. */
  size() {
    return this.#registry.size;
  }
}

/* Returns condition function from short-hand. */
function interpret_condition(condition) {
  if (condition) {
    if (is_primitive(condition)) {
      return ({ current }) => current === condition;
    }
    if (Array.isArray(condition)) {
      return ({ current }) => condition.includes(current);
    }
    if (condition === String) {
      return ({ current }) => typeof current === "string";
    }
    if (condition === Number) {
      return ({ current }) => typeof current === "number";
    }
    return condition;
  }
}
