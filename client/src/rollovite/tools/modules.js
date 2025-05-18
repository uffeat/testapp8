/*
import { Modules } from "@/rollovite/tools/modules.js";
20250518
v.1.0
*/

import { Base } from "@/rollovite/tools/_base.js";

/* 
NOTE
- Intended for non-global scope.
- Supports paths introspection.
- Supports batch import. */
export class Modules extends Base {
  #registry = new Map();

  constructor(map, { base, processor, query, type } = {}) {
    super();

    /* Check base */
    if (!base) {
      throw new Error(`'base' not provided`);
    }
    /* Build paths and registry from map */
    for (const [path, load] of Object.entries(map)) {
      /* Check type */
      if (type && !path.endsWith(`.${type}`)) {
        throw new Error(`Invalid type for path: ${path}`);
      }
      const key = path.slice("/src".length + base.length);

      this.#registry.set(key, load);
    }
    /* NOTE
    -  */

    this.__new__({
      base,
      /* Returns load function. */
      get: (path) => {
        const load = this.#registry.get(path);
        /* Error, if invalid path */
        if (!load) {
          throw new Error(`Invalid path: ${path}`);
        }
        return load;
      },
      processor,
      query,
      type,
    });
  }

  /* Batch-imports by filter. */
  async batch(filter) {
    const imports = [];
    const paths = this.paths().filter(filter);
    for (const path of paths) {
      imports.push(await this.import(path));
    }
    return imports;
  }

  /* Returns paths. */
  paths() {
    return Array.from(this.#registry.keys());
  }
}
