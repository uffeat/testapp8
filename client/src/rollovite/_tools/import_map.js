/*
import { ImportMap } from "@/rollovite/_tools/import_map.js";
20250526
v.1.0
*/

/* Do NOT import anything from outside 'rollovite' */

/* Utility for managing a single Vite import map. */
export class ImportMap {
  #_ = {};

  constructor(map, { type, raw = false }) {
    this.#_.map = map;
    this.#_.raw = raw;
    this.#_.type = type;
  }

  /* Returns 'raw' flag. */
  get raw() {
    return this.#_.raw;
  }

  /* Returns the file type, for which the import map applies. */
  get type() {
    return this.#_.type;
  }

  /* Returns load function. */
  get(path) {
    const load = this.#_.map[path.path];
    if (!load) {
      throw new Error(`Invalid path: ${path.specifier}`);
    }
    return load;
  }
}
