/*
import state from "@/rollocomponent/mixins/state.js";
20250601
v.1.0
*/
import { State } from "@/rollostate/state.js";

export default (parent, config) => {
  return class extends parent {
    static __name__ = "state";

    #_ = {};

    /* Returns state. */
    get state() {
      return this.#_.state;
    }

    /* Sets state. */
    set state(state) {
      if (state) {
        this.#_.state = new State({owner: this});
        if (typeof state === "object") {
          this.#_.state.update(state);
        }
        this.setAttribute("state", "");
      } else {
        this.#_.state = null;
        this.removeAttribute("state");
      }
    }

    /* Calls '__effect__' on descendants, if component has state and is host. */
    __init__() {
      super.__init__?.();
      if (this.state && this.hasAttribute("host")) {
        this.querySelectorAll(`[effect]`)
          .values()
          .forEach((c) => {
            this.state.effects.add(c.__effect__.bind(c));
          });
      }
    }
  };
};
