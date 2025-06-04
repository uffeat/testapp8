/*
import key from "@/rollocomponent/mixins/key.js";
20250604
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    /* Returns key. */
    get key() {
      return this.hasAttribute("key") ? this.getAttribute("key") : null;
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

/* NOTE 'key' is intended as a means to provide "soft identification", 
which in turn can facilitate intra-tree communication. */
