/*
import effect from "@/rollocomponent/mixins/effect.js";
20250530
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    /* Returns effect. */
    get effect() {
      return this.#_.effect;
    }

    /* Sets effect. 
    NOTE
    - 'effect' and 'state' interact. However, these props can be set 
      independently of each other, hence the need for additional control flow
      (for both props). */
    set effect(effect) {
      /* Abort, if no change */
      if (effect === this.#_.effect) return;
      if (effect) {
        /* Set effect as wrapper to provide component context */
        this.#_.effect = (...args) => effect.call(this, ...args);
        /* Add effect */
        this.state && this.state.effects.add(this.#_.effect);
      } else {
         /* Remove effect */
        this.state && this.state.effects.remove(this.#_.effect);
        /* Set effect */
        this.#_.effect = null;
      }
    }
  };
};
