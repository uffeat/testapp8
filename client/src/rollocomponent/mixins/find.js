/*
import find from "@/rollocomponent/mixins/find.js";
20250604
v.1.2
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "find";
    /* Unified (optional) alternative to 'querySelector' and 'querySelectorAll' 
    with a leaner syntax. */
    find(selector) {
      /* Most likely use concerns search for single descendant, 
      therefore start with querySelector */
      const result = this.querySelector(selector);
      if (result) {
        return result;
      }
      /* NOTE Return values() to enable direct use of iterator helpers. */
      return this.querySelectorAll(selector).values();
    }
  };
};
