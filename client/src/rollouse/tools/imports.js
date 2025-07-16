/*
import { Imports } from "@/rollouse/tools/imports.js";

*/

export class Imports {
  #_ = {
    regisitres: {},
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  add(map, { raw = false } = {}) {
    if (raw) {
      if (this.#_.regisitres.raw) {
        Object.assign(this.#_.regisitres.raw, map);
      } else {
        this.#_.regisitres.raw = map;
      }
    } else {
      if (this.#_.regisitres.unraw) {
        Object.assign(this.#_.regisitres.unraw, map);
      } else {
        this.#_.regisitres.unraw = map;
      }
    }

    return this.#_.owner;
  }

  import(path, { raw = false } = {}) {
    const registry = raw ? this.#_.regisitres.raw : this.#_.regisitres.unraw;
    const load = registry[path.path];
    if (!load) {
      throw new Error(`Invalid path: ${path.specifier}`);
    }
    return load();
  }

  

  size(raw = false) {
    const registry = raw ? this.#_.regisitres.raw : this.#_.regisitres.unraw;
    return Object.keys(registry).length;
  }

  __registry__(raw = false) {
    const registry = raw ? this.#_.regisitres.raw : this.#_.regisitres.unraw;
    return registry
  }
}
