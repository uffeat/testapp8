/*
import { Processor } from "@/rolloapp/tools/processor.js";
20250526
v.1.0
*/


/* Utility for managing a single processor callable. */
export class Processor {
  #_ = {
    registry: new Map(),
  };

  constructor(source, { cache = true } = {}) {
    this.#_.source = source;
    this.#_.cache = cache;
  }

  /* Calls source, subject to caching logic (inherent or as per call). */
  async call(key, result, { owner, path, cache = true } = {}) {
    if (!cache || !this.#_.cache) {
      return await this.#_.source.call(null, result, {
        owner,
        path,
      });
    }
    if (this.#_.registry.has(key)) return this.#_.registry.get(key);
    const processed = await this.#_.source.call(null, result, {
      owner,
      path,
    });
    this.#_.registry.set(key, processed);
    return processed;
  }
}
