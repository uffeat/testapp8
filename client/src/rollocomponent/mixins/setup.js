/*
import setup from "@/rollocomponent/mixins/setup.js";
20250530
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "setup";
    #_ = {};

    /* Returns setup method. */
    get __setup__() {
      return this.#_.setup;
    }

    /* Sets setup method. */
    set __setup__(setup) {
      if (setup) {
        this.#_.setup = setup.bind(this);
        this.setAttribute('setup', '')
      } else {
        this.removeAttribute('setup')
        this.#_.setup = null
      }
    }

    update(updates = {}) {
      super.update?.(updates);
      if (updates.__setup__) {
        this.__setup__ = updates.__setup__;
      }
      return this;
    }
  };
};
