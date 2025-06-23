/*

*/

/* 
NOTE
- Can be seen a hybrid between
  - a native promise that
    - has no reject, only resolve
    - can be reused 
    - can be resolved externally
    - exposes resolved state
    - exposes value state
  - a Rollo reactive util that
    - can only have a single effect
    - does no change-detection
    - can be made "awaitable", i.e., can block execution flow until resolved
    - supports a "then" syntax for adding the effect
  - Example use-cases:
    - Need a promise with the ability to inspect its fulfillment status.
    - Need a promise that can be reused without resetting 'then' callback.
    - Need a promise that keeps track of its own resolved value.
    - Need a reactive util that can block execution flow until value set.
    - Prefers a reactive util with a promise-like then-syntax for effect.
  - Can be used with two different syntax paradigms, e.g.:
    - const value = await future.complete();
    OR
    - future.then((value) => console.log('value', value)); */
export class Future {
  #current;
  #name = null;
  #owner = null;
  #previous;
  #promise;
  #resolve;
  #resolved = false;
  #then;

  constructor({ current, name, owner, then } = {}) {
    if (current !== undefined) {
      this.#current = current;
    }
    if (name !== undefined) {
      this.#name = name;
    }
    if (owner !== undefined) {
      this.#owner = owner;
    }
    if (then) {
      this.#then = then;
    }
    this.#refresh_promise();
  }

  /* Returns current value. */
  get current() {
    return this.#current;
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
  - Can, e.g., be used to indirectly expand feature set;
    available from then-function as 'owner.owner'. */
  get owner() {
    return this.#owner;
  }
  /* Sets owner. */
  set owner(owner) {
    this.#owner = owner;
  }

  /* Returns previous value 
  (current value from previous resolve session). */
  get previous() {
    return this.#previous;
  }

  /* Returns resolved state.
  NOTE
  - Returns true, if ever resolved, i.e., NOT session-bound. */
  get resolved() {
    return this.#resolved;
  }

  /* Blocks execution flow until resolved, optionally on condition, and then 
  refrehses promise. Returns current value. */
  async complete(condition) {
    if (!condition || condition.call(this, this)) {
      await this.#promise;
      this.#refresh_promise();
      return this.#current;
    }
  }

  /* Resolves current sessions's promise. Chainable. */
  resolve(value) {
    this.#previous = this.#current;
    this.#current = value;
    this.#resolved = true;
    /* Resolve the actual promise */
    this.#resolve(value);
    this.#then?.call(this, value, { owner: this });
    this.#refresh_promise();
    return this;
  }

  /* Sets 'then' callback. Chainable. */
  then(then) {
    this.#then = then;
    return this;
  }

  /* Enables repeated use of 'complete()'. */
  #refresh_promise() {
    const { promise, resolve } = Promise.withResolvers();
    this.#promise = promise;
    this.#resolve = resolve;
  }
}


