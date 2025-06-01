/*
import state from "@/rollocomponent/mixins/state.js";
20250601
v.1.0
*/
import { State } from "@/rollocomponent/tools/state.js";

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    /* Returns state. */
    get state() {
      return this.#_.state;
    }

    /* Sets state. */
    set state(state) {
      if (state) {
        this.#_.state = new State(this);
        this.setAttribute("state", "");
      } else {
        this.#_.state = null;
        this.removeAttribute("state");
      }
    }

    __new__() {
      super.__new__?.();
      if (this.state) {
        this.querySelectorAll(`[effect]`)
          .values()
          .forEach((c) => {
            this.state.effects.add(c.effect.bind(c));
          });
      }
    }
  };
};
