/*
import state from "@/rollocomponent/mixins/state.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    /* Returns effect. */
    get effect() {
      return this.#_.effect;
    }

    /* Sets effect. */
    set effect(effect) {
      /* Abort, if no change */
      if (effect === this.#_.effect) return;
      if (effect) {
        this.#_.effect = (...args) => effect.call(this, ...args);
        if (this.state) {
          this.state.effects.add(this.#_.effect);
        }
      } else {
        this.state.effects.remove(this.#_.effect);
        this.#_.effect = null;
      }



    
      
      
    }
  };
};
