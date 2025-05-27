/*
import novalidation from "@/rollocomponent/mixins/novalidation.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    /* Returns 'novalidation' attribute. */
    get noValidation() {
      return this.getAttribute("for");
    }

    /* Sets 'novalidation' attribute. */
    set noValidation(noValidation) {
      if (noValidation) {
        this.setAttribute("novalidation", "");
      } else {
        this.removeAttribute("novalidation");
      }
    }
  };
};
