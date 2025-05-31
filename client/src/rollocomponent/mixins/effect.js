/*
import effect from "@/rollocomponent/mixins/effect.js";
20250531
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {}
    /* Returns effect. */
    get effect() {
      return this.#_.effect
    }

    /* Sets effect. */
    set effect(effect) {
      if (effect) {
        this.setAttribute("effect", '');
        
      } else {
        this.removeAttribute("effect");
      }
      this.#_.effect = effect
    }
  };
};
