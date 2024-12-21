/* Argument for effects. */
export class Message {
  static create = (...args) => {
    return new Message(...args);
  };
  constructor({ current, previous, owner }) {
    this.#current = current;
    this.#owner = owner;
    this.#previous = previous;
  }

  /* Returns current. */
  get current() {
    return this.#current;
  }
  #current;

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns previous. */
  get previous() {
    return this.#previous;
  }
  #previous;
}
