/*
import { Processors } from "@/rollovite/tools/_processors.js";
20250518
v.1.0
*/

export class Processors {
      #owner
      #registry = new Map();

      constructor(owner) {
        this.#owner = owner
      }

      add(spec) {
        Object.entries(spec).forEach(([key, source]) => {
          /* Enforce no-duplication */
          if (this.#registry.has(key)) {
            throw new Error(`Duplicate key: ${key}`);
          }
          this.#registry.set(key, new Processor(this.#owner, source));
        });
        return this;
      }

      clear() {
        this.#registry.clear();
        return this;
      }

      get(key) {
        return this.#registry.get(key);
      }

      has(key) {
        return this.#registry.has(key);
      }

      keys() {
        return this.#registry.keys();
      }

      remove(key) {
        this.#registry.delete(key);
        return this;
      }
    }