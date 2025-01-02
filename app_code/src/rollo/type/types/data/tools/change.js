/* ChangeType constructor */
export function Change(...args) {
  return new ChangeType(...args);
}

/* Argument for effect. 
NOTE
- Should generally not be used externally.
*/
export class ChangeType {
  /* Non-error exception to signal break of effects execution loop. */
  static StopException = (() =>
    class StopException extends Error {
      static raise = () => {
        throw new StopException();
      };
      constructor() {
        super("");
        this.name = "StopException";
      }
    })();

  constructor({ data, effect, index = null, owner, session = null } = {}) {
    if (!owner) {
      throw new Error(`'owner' required.`);
    }
    this.#data = data;
    this.#owner = owner;
    this.#session = session;
    this.update({ effect, index });
  }

  /* Returns data. */
  get data() {
    return this.#data;
  }
  #data;

  /* Returns effect.
  NOTE
  - Provides easy access to the effect itself from inside the effect 
    source/condition.
  */
  get effect() {
    return this.#effect;
  }
  /* Sets  effect.
  NOTE
  - Can, but should generally not, be used externally. 
  */
  set effect(effect) {
    this.#effect = effect;
  }
  #effect;

  /* Returns effect index for the current session. */
  get index() {
    return this.#index;
  }
  /* Sets index.
  NOTE
  - Can, but should generally not, be used externally. 
  */
  set index(index) {
    this.#index = index;
  }
  #index;

  /* Returns owner */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns session id. */
  get session() {
    return this.#session;
  }
  #session;

  /* Returns timestamp. */
  get time() {
    return this.#time;
  }
  #time = Date.now();

  /* Signals stop of effects execution loop.
  NOTE
  - Conceptually similar to 'event.stopPropagation'.
  */
  stop() {
    ChangeType.StopException.raise();
  }

  /* Batch-updates data- and accessor props. Chainable. */
  update(update) {
    for (const [k, v] of Object.entries(update)) {
      this[k] = v;
    }
    return this;
  }
}
