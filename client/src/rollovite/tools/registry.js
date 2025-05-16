/*
import { registry } from "@/rollovite/tools/registry.js";
20250516
v.1.0
*/

export const registry = new (class {
  #registry = new Map();

  add(key, load) {
    this.#registry.set(key, load);
    return this;
  }

  get(key) {
    return this.#registry.get(key)
  }

  has(key) {
    return this.#registry.has(key)
  }

  keys(filter) {
    const keys = Array.from(this.#registry.keys())
    if (filter) {
      return keys.filter(filter)
    }
    return keys
  }
})();
