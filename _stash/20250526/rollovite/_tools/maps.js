/*
import { Maps } from "@/rollovite/_tools/maps.js";
20250525
v.1.0
*/

/* Do NOT import anything from outside 'rollovite' */

/* Utility for managing import maps. */
export class Maps {
  #_ = {
    registry: new Map(),
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* Adds import maps. Chainable with respect to owner. */
  add(...specs) {
    specs.forEach((spec) => {
      Object.entries(spec).forEach(([key, map]) => {
        /* Enforce no-duplication */
        if (this.#_.registry.has(key)) {
          throw new Error(`Duplicate key: ${key}`);
        }
        this.#_.registry.set(
          key,
          /* Wrap in class to encapsulate */
          new (class {
            #map;

            constructor(_map) {
              this.#map = _map;
            }

            /* Returns copy of import map with normalized paths, 
                optionally filtered, optionally as Map instance.
                For external use ONLY. */
            copy(filter, { format = "object" } = {}) {
              const entries = (() => {
                const _entries = Object.entries(this.#map).map(
                  ([path, load]) => [`@/${path.slice("/src/".length)}`, load]
                );
                return filter
                  ? _entries.filter(([path, load]) => filter(path))
                  : _entries;
              })();

              return format === "object"
                ? Object.fromEntries(entries)
                : new Map(entries);
            }

            /* Returns load function. */
            get(path) {
              const load = this.#map[path.path];
              if (!load) {
                throw new Error(`Invalid path: ${path.path}`);
              }
              return load;
            }
          })(map)
        );
      });
    });
    return this.#_.owner;
  }

  /* Returns wrapped import map. */
  get(key) {
    /* key is likely valid -> most efficient to use 'get' 
    directly without a 'has' step. */
    const wrapped = this.#_.registry.get(key);
    if (!wrapped) {
      throw new Error(`Invalid key: ${key}`);
    }
    return wrapped;
  }
}
