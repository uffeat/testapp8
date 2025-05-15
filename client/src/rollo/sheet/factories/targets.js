/* 
20250302 
src/rollo/sheet/factories/targets.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/factories/targets.js
*/

import { adopt, unadopt } from "@/rollo/sheet/tools/target.js";

export const targets = (parent, config, ...factories) => {
  return class extends parent {
    static name = "targets";

    #targets = new Targets(this);

    /* Returns targets controller. */
    get targets() {
      return this.#targets;
    }

    /* Adopts sheet. Chainable. */
    bind(...targets) {
      this.targets.add(...targets);
      return this;
    }

    /* Unadopts sheet. Chainable. */
    unbind(...targets) {
      if (targets.length) {
        this.targets.remove(...targets);
      } else {
        this.targets.clear();
      }
      return this;
    }
  };
};

/* Sheet-bound controller for managing adoption/unadoption of sheet to targets. 
NOTE
- Ensures that 
  - the sheet is not "over-adopted" by a given target
  - the sheet is only unadopted from a given target (a potentially costly),
    if the sheet has been adopted by the target.
*/
class Targets {
  #registry = new Set();
  #sheet;

  constructor(sheet) {
    this.#sheet = sheet;
  }

  /* Returns copy of registry. */
  get registry() {
    return [...this.#registry];
  }

  /* Returns sheet. */
  get sheet() {
    return this.#sheet;
  }

  /* Returns number of targets, sheet has been adopted to. */
  get size() {
    return this.#registry.size;
  }

  /* Adopts sheet to given targets. Chainable. */
  add(...targets) {
    for (const target of targets) {
      if (!this.#registry.has(target)) {
        adopt(target, this.sheet);
        this.#registry.add(target);
      }
    }
    return this;
  }

  /* Unadopts sheet from all targets. Chainable. */
  clear() {
    for (const target of this.#registry.values()) {
      unadopt(target, this.sheet);
    }
    this.#registry.clear();
    return this;
  }

  /* Tests, if target has adopted sheet. */
  has(target) {
    return this.#registry.has(target);
  }

  /* Unadopts sheet from given targets. Chainable. */
  remove(...targets) {
    for (const target of targets) {
      if (this.#registry.has(target)) {
        unadopt(target, this.sheet);
        this.#registry.delete(target);
      }
    }
    return this;
  }
}
