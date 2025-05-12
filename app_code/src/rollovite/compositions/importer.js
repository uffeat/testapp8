/*
import { Importer } from "@/rollovite/compositions/importer.js";
v.1.0
20250512
*/

import { factory } from "@/rollovite/tools/factory.js";

export class Importer {
  #owner;

  constructor(owner) {
    this.#owner = owner;
  }

  create(base) {
    const owner = this.#owner;

    return new (class {
      #factory = factory.call(this);

      /* Return import with Python-like syntax. */
      get path() {
        return this.#factory;
      }

      /* Return import. */
      import(path, ...args) {
        return owner.import(`${base}/${path}`, ...args);
      }
    })();
  }
}
