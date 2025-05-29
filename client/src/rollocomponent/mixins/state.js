/*
import state from "@/rollocomponent/mixins/state.js";
20250530
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
      this.#_.state && this.#_.state.effects.remove(this.effect);
      /* Add effect to new state */
      state && state.effects.add(this.effect)
      /* Set state */
      this.#_.state = state;
    }
  };
};
