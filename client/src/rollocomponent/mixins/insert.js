/*
import insert from "@/rollocomponent/mixins/insert.js";
20250527
v.1.0
*/

import { Insert } from "@/rollocomponent/tools/insert.js";

export default (parent, config, ...mixins) => {
  return class extends parent {
    #_ = {};
    
    __new__() {
      super.__new__?.();
      this.#_.insert = new Insert(this);
    }

    /* Inserts elements. 
    Syntactical alternative to insertAdjacentElement with a leaner syntax and 
    ability to handle multiple elements. */
    get insert() {
      return this.#_.insert;
    }
  };
};
