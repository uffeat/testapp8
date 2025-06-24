/*
import { ImportMaps } from "@/rolloapp/_tools/import_maps.js";
20250526
v.1.0
*/


/* Utility for managing import maps. */
export class ImportMaps {
  #_ = {
    registry: new Map(),
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* Adds import maps. Chainable with respect to owner. */
  add(...specs) {
    specs.forEach((import_map) => {
      const key = import_map.raw ? `${import_map.type}?raw` : import_map.type;

      if (this.#_.registry.has(key)) {
        throw new Error(`Duplicate key: ${key}`);
      }
      this.#_.registry.set(key, import_map);
    });
    return this.#_.owner;
  }

  /* Returns wrapped import map. */
  get(path, { raw }) {
    const key = raw ? `${path.type}?raw` : path.type;
    /* key is likely valid -> most efficient to use 'get' 
    directly without a 'has' step. */
    const import_map = this.#_.registry.get(key);
    if (!import_map) {
      throw new Error(`Invalid key: ${key}`);
    }
    return import_map.get(path);
  }
}
