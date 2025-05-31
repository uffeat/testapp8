/*
import key from "@/rollocomponent/mixins/key.js";
20250530
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    /* Returns key. */
    get key() {
      if (!this.hasAttribute("key")) {
        return null
      }
      return this.getAttribute("key");
    }

    /* Sets key. */
    set key(key) {
      if ([false, null].includes(key)) {
        this.removeAttribute("key");
      } else {
        this.setAttribute("key", key);
      }
    }
  };
};

/* NOTE
- 'key' is intended as a means provide "soft identification", which in turn
  - likely, in combination with 'setup' and 'host' - can facilitate intra-tree 
  communication within instance factory functions. */

