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
      this.#_.state = state === true ? new State() : state;
      if (state) {
        this.setAttribute("state", "");
      } else {
        this.removeAttribute("state");
      }
    }

    /* Calls '__effect__' on descendants, if component has state. */
    __init__() {
      super.__init__?.();
      if (this.state) {
        this.querySelectorAll(`[effect]`)
          .values()
          .forEach((c) => {
            this.state.effects.add(c.__effect__.bind(c));
          });
      }
    }
  };
};
