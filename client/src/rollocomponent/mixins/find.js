/*
import find from "@/rollocomponent/mixins/find.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    /* Unified alternative to 'querySelector' and 'querySelectorAll' a leaner syntax. */
    find(selector) {
      const result = this.querySelectorAll(selector)
      if (result.length === 0) {
        return null
      }
      if (result.length === 1) {
        return result[0]
      }
      /* NOTE Return values() to enable direct use of iterator helpers. */
      return result.values()
      
    }
  };
};
