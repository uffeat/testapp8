/*
import setup from "@/rollocomponent/mixins/setup.js";
20250530
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};

    /* Returns setup method. */
    get setup() {
      return this.#_.setup;
    }

    /* Sets setup method. */
    set setup(setup) {
      if (setup) {
        this.#_.setup = setup.bind(this);
      }
    }
  };
};
