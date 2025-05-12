import { factory } from "@/rollovite/tools/factory.js";

export const path = (parent, config, ...factories) => {
  return class Path extends parent {
    static name = "Path";

    #factory;

    constructor() {
      super();
      this.#factory = factory.call(this, config.base);
    }

    /* Returns import with Python-like syntax. */
    get path() {
      return this.#factory;
    }
  };
};
