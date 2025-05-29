/*
import state from "@/rollocomponent/mixins/state.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    /* Returns state. */
    get state() {
      return this.#_.state;
    }

    /* Sets state. */
    set state(state) {
      /* Abort, if no change */
      if (state === this.#_.state) return
      /* Remove effect from previous state */
      if (this.#_.state) {
        this.#_.state.effects.remove(this.effect);
      }
      /* Add effect to new state */
      if (state) {
        state.effects.add(this.effect)
      }
      this.#_.state = state;
    }
  };
};
