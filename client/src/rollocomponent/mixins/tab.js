/*
import tab from "@/rollocomponent/mixins/tab.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {

    /* Returns tabindex. */
    get tab() {
      return this.getAttribute("tabindex");
    }

    /* Sets tabindex. */
    set tab(tab) {
      if ([false, null].includes(tab)) {
        this.removeAttribute("tabindex");
      } else {
        this.setAttribute("tabindex", tab);
      }
    }
   
    

  };
};
