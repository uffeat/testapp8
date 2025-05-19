/*
import { Processor } from "@/rollovite/tools/_processor.js";
20250518
v.1.1
*/

/* Utility for post-processing import result.
NOTE
- Rollo import engine member. 
- Can, but should typically not, be used stand-alone. */
export class Processor {
  #frozen = false;
  #owner;
  #source;
  #cache = new Map();

  constructor(owner, source) {
    this.#owner = owner;
    this.#source = source;
  }

  /* Provides full exposure of cache. */
  get cache() {
    if (this.frozen) {
      throw new Error(`Frozen.`);
    }
    return this.#cache;
  }

  get frozen() {
    return this.#frozen;
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
    if (this.frozen) {
      throw new Error(`Frozen.`);
    }
    this.#source = source;
  }

  /* Returns processed result.*/
  async call(context, path, result) {
    if (this.#cache.has(path)) return this.#cache.get(path);
    const processed = await this.source.call(context, result, {
      context,
      owner: this,
      path,
    });
    this.#cache.set(path, processed);
    return processed;
  }

  /* Prevents change of 'source' and access to 'cache'. */
  freeze() {
    if (this.frozen) {
      throw new Error(`Frozen.`);
    }
    this.#frozen = true;
    /* Return escape hatch */
    return [(source) => (this.#source = source), this.#cache];
  }
}
