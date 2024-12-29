

/* Argument for effect sources and effect conditions. */
export class Change {
  static create = (...args) => new Change(...args);

  constructor({ current, effect, index, previous, publisher, session }) {
    this.#effect = effect;
    this.#index = index;
    

    this.#current = current
    this.#previous = previous



    this.#publisher = publisher;
    this.#session = session;
    this.#time = Date.now();
  }

  /* Returns current data. */
  get current() {
    return this.#current;
  }
  #current;

  /* Returns effect.
  NOTE
  - Provides easy access to the effect itself from inside the effect 
    source/condition.
  */
  get effect() {
    return this.#effect;
  }
  #effect;

  /* Returns effect index for the current session. */
  get index() {
    return this.#index;
  }
  #index;

  /* Returns previous data. */
  get previous() {
    return this.#previous;
  }
  #previous;

  /* Returns publisher. */
  get publisher() {
    return this.#publisher;
  }
  #publisher;

  /* Returns session id. */
  get session() {
    return this.#session;
  }
  #session;

  /* Returns timestamp. */
  get time() {
    return this.#time;
  }
  #time;
}