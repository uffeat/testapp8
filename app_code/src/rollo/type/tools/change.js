import { stop } from "@/rollo/type/tools/stop";


/* TODO
- clone method
*/


/* Argument for effect. 
NOTE
- Should generally not be used externally. */
export class Change {
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
    source/condition. */
  get effect() {
    return this.#effect;
  }
  /* Sets  effect.
  NOTE
  - Can, but should generally not, be used externally. */
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
  - Can, but should generally not, be used externally. */
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
  /* Sets time.
  NOTE
  - Can, but should generally not, be used externally. */
  set time(time) {
    this.#time = time;
  }
  #time = Date.now();

   /* Creates and returns clone with selected props. 
   NOTE
  - Since 'data' may be a mutable, it's not included, but can be set from arg. */
  clone(data) {
    const clone = new Change({
      data: data || {},
      effect: this.effect,
      index: this.index,
      owner: this.#owner,
      session: this.#session
    });
    clone.time = this.time
    return clone
  }

  /* Signals stop of effects execution loop.
  NOTE
  - Conceptually similar to 'event.stopPropagation'.
  */
  stop() {
    stop();
  }

  /* Batch-updates accessor props. Chainable.
  NOTE
  - undefined values are ignored. 
  - Allows setting of data props with '_'-prefix. */
  update(update) {
    for (const [k, v] of Object.entries(update)) {
      if (!(k in this) && !k.startsWith('_')) {
        throw new Error(`Invalid key: ${k}`)
      }
      if (v !== undefined) {
        this[k] = v;
      }
    }
    return this;
  }
}
