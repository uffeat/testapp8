// import { Future } from "@/rollo/tools/future";
// const { Future } = await import("@/rollo/tools/future");

/* Returns FutureType instance.
NOTE
- Promise-like stateful object with 
  - explicit reject/resolve
  - universal persistant callback
  - ability to recreate promise */
export function Future({ callback, name, owner, value } = {}) {
  return new FutureType({ callback, name, owner, value });
}

/* Wraps a promise instance.
NOTE
- The ability to settle the wrapped promise via 'resolve'/'reject' 
  methods, i.e., externally with respect to the promise executor is a 
  core feature of 'FutureType'. This feature is indeed natively available 
  with Promise.withResolvers(). However, 'FutureType' also provides 
  non-native features, including:
  - Ability to recreate promise.
  - Persistant state (value and settled/rejected/resoved state).
  - Universal callback method.
  - Strict enforcing of rejected/resolved value types. 
- 'FutureType' could be regarded as 
  - a stateful Promise with explicit resolve/reject and option for recreation
  or
  - an awaitable value object with a single-subscriber pub-sub mechanism. */
class FutureType {
  /* Set name explicitly, since bundler may change class name */
  static name = "FutureType";
  #promise;
  #reject;
  #resolve;
  #session = -1;
  #value;

  constructor({ callback, name, owner, value } = {}) {
    this.callback = callback;
    this.name = name;
    this.owner = owner;
    this.reset(value);
  }

  /* Returns callback. */
  get callback() {
    return this.#callback;
  }
  /* Sets callback. */
  set callback(callback) {
    this.#callback = callback;
  }
  #callback;

  /* Returns name. */
  get name() {
    return this.#name;
  }
  /* Sets name. */
  set name(name) {
    this.#name = name;
  }
  #name;

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  /* Sets owner. */
  set owner(owner) {
    this.#owner = owner;
  }
  #owner;

  /* Returns rejected status. */
  get rejected() {
    return this.#rejected;
  }
  #rejected;

  /* Returns resolved status. */
  get resolved() {
    return this.#resolved;
  }
  #resolved;

  /* Returns settled status. */
  get settled() {
    return this.resolved || this.rejected;
  }

  /* Returns session. */
  get session() {
    return this.#session;
  }

  /* Returns awaitable value. */
  get value() {
    return this.#promise.then(
      (value) => Promise.resolve(value),
      (error) => Promise.reject(error)
    );
    /* Alternative implementation:
    return new Promise((resolve, reject) => {
      this.#promise.then(resolve).catch(reject);
    });
    */
  }
  /* Resolves/rejects to value.
  NOTE
  - Error instances reject
  - Non-Error instances resolve. */
  set value(value) {
    if (value instanceof Error) {
      this.reject(value);
    } else {
      this.resolve(value);
    }
  }

  /* Recreates promise and resets value and rejected/resolved status. 
  Chainable. 
  NOTE
  - Passing in a non-undefined value immediately settles the promise. */
  reset(value) {
    this.#promise = new Promise((resolve, reject) => {
      this.#reject = reject;
      this.#resolve = resolve;
    });
    /*
    Alternative to the declared 'value' getter:
    Object.defineProperty(this, `value`, {
      configurable: true,
      enumerable: true,
      get: async () => await this.#promise,
    });
    */
    this.#rejected = false;
    this.#resolved = false;
    ++this.#session;
    this.#value = null;

    if (value !== undefined) {
      this.value = value;
    }
    return this;
  }

  /* Rejects promise. Chainable. */
  reject(value) {
    if (!(value instanceof Error)) {
      console.error("Error re:", this);
      throw new TypeError(
        `Rejected values should be an error! Got: ${String(value)}`
      );
    }
    this.#reject(value);
    this.#rejected = true;
    this.#resolved = false;
    this.#value = value;
    if (this.callback) {
      this.callback(value, this);
    }
    return this;
  }

  /* Resolves promise. Chainable. */
  resolve(value) {
    if (value instanceof Error) {
      console.error("Error re:", this);
      throw new TypeError(
        `Resolved values should not be an error! Got: ${String(value)}`
      );
    }
    this.#resolve(value);
    this.#rejected = false;
    this.#resolved = true;
    this.#value = value;
    if (this.callback) {
      this.callback(value, this);
    }
    return this;
  }

  /* Returns string representation of instance. */
  toString() {
    try {
      return JSON.stringify({
        callback: this.callback ? String(this.callback) : null,
        owner: this.owner ? String(this.owner) : null,
        name: this.name || null,
        rejected: this.rejected,
        resolved: this.resolved,
        session: this.session,
        value:
          typeof this.#value === "bigint"
            ? `${this.#value}n`
            : [false, null, true].includes(this.#value) ||
              ["number", "string"].includes(typeof this.#value)
            ? this.#value
            : String(this.#value),
      });
    } catch {
      return this.constructor.name;
    }
  }

  /* Sets callback. Chainable.
  NOTE
  - Syntactical alternative to setting 'callback'. */
  then(callback) {
    this.callback =  callback
    return this;

  }

  /* Resolves/rejects to value. Chainable.
  NOTE
  - Syntactical alternative to setting 'value'. */
  update(value) {
    this.value = value;
    return this;
  }
}
