/*
import { Base } from "@/rollovite/tools/_base.js";
20250518
v.1.0
*/

import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/*
  */
export class Base {
  #_ = {};

  __new__({ base, get, processor, query = "", type = "js" }) {
    this.#_.base = base;
    this.#_.get = get;
    /* NOTE
    - Critial for aggregators that no query is specified as an empty string! */
    this.#_.query = query;
    this.#_.type = type;

    if (processor) {
      this.processor(processor);
    }
    this.#_.$ = syntax(
      this.base ? "" : "@",
      this,
      (part) => part === this.type
    );
    /* Prevent __new__ from being called again */
    delete this.__new__;
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#_.$;
  }

  /* Returns base. */
  get base() {
    return this.#_.base;
  }

  /* Returns query. */
  get query() {
    return this.#_.query;
  }

  /* Returns type. */
  get type() {
    return this.#_.type;
  }

  /* Returns import. */
  async import(path) {
    /* Remove query 
    NOTE
    - Critial for aggregators that 'import' can be called with query! */
    if (this.query && path.endsWith(this.query)) {
      path = path.slice(0, -this.query.length);
    }
    /* Add type */
    if (this.type && !path.endsWith(`.${this.type}`)) {
      path = `${path}.${this.type}`;
    }
    /* Get load function from native path key */
    const load = this.#_.get(path);
    /* Import */
    const result = await load();
    /* Process */
    const processor = this.processor();
    if (processor) {
      const processed = await processor.call(this, path, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        return processed;
      }
    }
    return result;
  }

  /* Returns and/or configures processor.
  NOTE
  - Combined getter/setter for 'processor':
    - If no arg, returns Processor instance, or null, if not set up.
    - If source, creates, sets and returns Processor instance from function.
    - If null arg, removes processor.
  - 'source' should be a (optionally) async function with the signature:
      (this, result, { owner: this, key })
    Can also be an object with a 'call' method or a Processor instance.
  - Supports (exposed) caching.
  - Supports highly dynamic patterns. 
  - undefined processor results are ignored as a means to selective 
    processing. */
  processor(source) {
    if (source) {
      if (source instanceof Processor) {
        this.#_.processor = source;
      } else {
        this.#_.processor = new Processor(this, source);
      }
    } else {
      if (source === null) {
        /* Clean up and remove processor */
        if (this.#_.processor instanceof Processor) {
          this.#_.processor.cache.clear();
        }
        this.#_.processor = null;
      }
    }
    return this.#_.processor;
  }
}