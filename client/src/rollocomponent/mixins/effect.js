/*
import effect from "@/rollocomponent/mixins/effect.js";
20250531
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "effect";
    #_ = {};
    /* Returns effect. */
    get __effect__() {
      return this.#_.effect;
    }

    /* Sets effect. */
    set __effect__(effect) {
      this.#_.effect = effect;
      if (effect) {
        this.setAttribute("effect", "");
      } else {
        this.removeAttribute("effect");
      }
    }

    update(updates = {}) {
      super.update?.(updates);
      if (updates.__effect__) {
        this.__effect__ = updates.__effect__;
      }
      return this;
    }
  };
};
