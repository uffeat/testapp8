/* 

*/

import { Reactive } from "@/rollo/reactive/value.js";

export const states = (parent, config, ...factories) => {
  return class extends parent {
    static name = "states";

    #states;

    constructor() {
      super();
      this.#states = Object.freeze({
        value: Reactive(null, { owner: this }),
      });
    }

    /* Returns object with reactive states. */
    get states() {
      return this.#states;
    }
  };
};
