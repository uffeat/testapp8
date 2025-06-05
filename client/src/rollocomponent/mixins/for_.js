/*
import for_ from "@/rollocomponent/mixins/for_.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "for_";
    /* Returns 'for' attribute. */
    get for_() {
      return this.getAttribute("for");
    }

    /* Sets 'for' attribute. */
    set for_(for_) {
      if (for_) {
        this.setAttribute("for", for_);
      } else {
        this.removeAttribute("for");
      }
    }
  };
};
