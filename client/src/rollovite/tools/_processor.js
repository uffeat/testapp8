/*
import { Processor } from "@/rollovite/tools/_processor.js";
20250513
v.1.0
*/

/* Utility for post-processing import result.
NOTE
- Part of Rollo's import system. */
export class Processor {
  #owner;
  #source;
  #cache = new Map();

  constructor(owner, source) {
    this.#owner = owner;
    this.#source = source;
  }

  /* Provides full exposure of cache. */
  get cache() {
    return this.#cache;
  }

  /* Returns owner (Modules instance). */
  get owner() {
    return this.#owner;
  }

  /* Returns source callable. */
  get source() {
    return this.#source;
  }

  /* Sets source callable.
    NOTE
    - Can be replaced from inside the source function itself via the 'owner' 
      kwarg. */
  set source(source) {
    this.#source = source;
  }

  /* Invokes post-processing of import.
    NOTE
    - Called as post-processor. */
  async call(context, key, result) {
   
    if (this.#cache.has(key)) {
      return this.#cache.get(key);
    }
    const processed = await this.#source.call(this, result, { owner: this, key });
    this.#cache.set(key, processed);
    return processed;
  }
}
