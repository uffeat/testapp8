/* Utility for post-processing import result.
NOTE
- Part of Rollo's import system. */
  export class Processor {
    #owner;
    #processor;
    #cache = new Map();

    constructor(owner, processor) {
      this.#owner = owner;
      this.#processor = processor;
    }

    /* Provides full exposure of cache. */
    get cache() {
      return this.#cache;
    }

    /* Returns owner (Modules instance). */
    get owner() {
      return this.#owner;
    }

    /* Returns processor callable. */
    get processor() {
      return this.#processor;
    }

    /* Sets processor callable.
    NOTE
    - Can be replaced from inside the processor function itself via the 'owner' 
      kwarg. */
    set processor(processor) {
      this.#processor = processor;
    }

    /* Invokes post-processing of import.
    NOTE
    - Called as post-processor. */
    async call(context, path, result) {
      /* NOTE
      - 'path' is a Path instance. */
      if (this.#cache.has(path.path)) {
        return this.#cache.get(path.path);
      }
      const processed = await this.processor.call(this, result, {
        owner: this,
        path,
      });
      this.#cache.set(path.path, processed);
      return processed;
    }
  }