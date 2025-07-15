/*
import { Imports } from "@/rolloapp/tools/imports.js";

*/

export class Imports {
  #_ = {
    regisitres: {
      raw: new Map(),
      unraw: new Map(),
    },
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  add(map, { raw = false } = {}) {
    const registry = raw ? this.#_.regisitres.raw : this.#_.regisitres.unraw;
    for (const [path, load] of Object.entries(map)) {
      if (registry.has(path.path)) {
        throw new Error(`Duplicate path: ${path}`);
      }
      registry.set(path, load);
    }
    return this.#_.owner;
  }

  import(path, { raw = false } = {}) {
    const registry = raw ? this.#_.regisitres.raw : this.#_.regisitres.unraw;
    if (!registry.has(path.path)) {
      throw new Error(`Invalid path: ${path.specifier}`);
    }
    const load = registry.get(path.path);
    return load();
  }

  maps({ filter, raw = false } = {}) {
    const registry = raw ? this.#_.regisitres.raw : this.#_.regisitres.unraw;
    
    const entries = Array.from(registry.entries(), ([path, load]) => [
      `@/${path.slice("/src/".length)}`,
      load,
    ])
    if (filter) {
      return Object.fromEntries(entries.filter(filter));
    }
    return Object.fromEntries(entries);
  }

  size(raw = false) {
    const registry = raw ? this.#_.regisitres.raw : this.#_.regisitres.unraw;
    return registry.size;
  }
}
