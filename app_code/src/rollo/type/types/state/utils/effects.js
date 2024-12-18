import { type } from "rollo/type/type";
import { Handler } from "rollo/type/types/state/utils/handler";
import { Effect } from "rollo/type/types/state/utils/effect";

/* Controller for effect handlers. */
export class Effects {
  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns effects registry.
  NOTE
  - Can, but should generally not, be mutated outside the Effects class. */
  get registry() {
    return this.#registry;
  }
  #registry = new Map();

  /* Returns number of registered effecs. */
  get size() {
    return this.#registry.size;
  }

  /* Registers, calls and returns effect.
  NOTE 
  - Effects are stored as keys with condition as values. */
  add({ condition, source, transformer }) {
    /* TODO
    - handler owner?
    */
    /* Create handler */
    const handler = new Handler({ condition, source, transformer })
    /* Register effect */
    this.#registry.set(handler, true);
    /* Call handler for each item */
    /* TODO
    */

    
    /* Return handler to enable later removal */
    return handler;
  }

  /* Tests, if effect is in registry. */
  has(handler) {
    return this.#registry.has(handler);
  }

  /* Calls handlers.
  NOTE
  - Can, but should generally not, be called outside the State class. */
  notify(effect) {
    for (const [handler, _] of this.#registry) {
      handler(effect)
    }
  }

  /* Removes effect. */
  remove(handler) {
    this.#registry.delete(handler);
  
  }
}


