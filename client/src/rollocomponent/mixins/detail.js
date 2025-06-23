/*
import detail from "@/rollocomponent/mixins/detail.js";
20250623
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "detail";

    #_ = {
      detail: {},
    };

    /* Returns detail. */
    get detail() {
      return this.#_.detail;
    }
  };
};
