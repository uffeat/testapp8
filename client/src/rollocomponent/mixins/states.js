/*
import states from "@/rollocomponent/mixins/states.js";
20250623
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "states";

    #_ = {
      states: {}
    };

    /* Returns states. */
    get states() {
      return this.#_.states;
    }

    

  
  };
};
