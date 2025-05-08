/* Utility for cache storage and retrieval.
NOTE
- Pass in creator at construction, parity between cache key and creator arg 
  (the basic standard case). 
- Pass in in creator in 'get', if creator has another signature (the more 
  advanced and flexible case). */
  export class Cache {
    #registry = new Map();
    #creator;
  
    constructor(creator) {
      this.#creator = creator;
    }
  
    /* Returns cached value created by 'creator'. 
    NOTE
    - First invocation, creates, caches and returns value.
    - Subsequent invocations returns value from cache. */
    async get(key, creator) {
      let value = this.#registry.get(key);
      if (value) {
        return value;
      }
      if (creator) {
        value = await creator.call(null);
      } else {
        value = await this.#creator.call(null, key);
      }
  
      this.#registry.set(key, value);
      return value;
    }
  }