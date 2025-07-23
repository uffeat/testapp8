/*

*/

/* Utility for managing a single processor callable. */
export class Processor {
  #_ = {
    registry: new Map(),
  };

  constructor(source, { cache = true, detail } = {}) {
    this.#_.cache = cache;
    this.#_.detail = detail;
    this.#_.source = source;
  }

  /* Calls source, subject to caching logic (inherent or as per call). */
  async call(key, result, { owner, path, cache = true } = {}) {
    if (!cache || !this.#_.cache) {
      return await this.#_.source.call(owner, result, {
        detail: this.#_.detail,
        owner,
        path,
      });
    }
    if (this.#_.registry.has(key)) return this.#_.registry.get(key);
    const processed = await this.#_.source.call(owner, result, {
      detail: this.#_.detail,
      owner,
      path,
    });
    this.#_.registry.set(key, processed);
    return processed;
  }
}
