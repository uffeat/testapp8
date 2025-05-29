/*
import host from "@/rollocomponent/mixins/host.js";
20250530
v.1.0
*/

export default (parent, config) => {
  return class extends parent {

    #_ = {}
    /* Returns host. */
    get host() {
      return this.#_.host
    }

    /* Sets host. 
    NOTE
    - */
    set host(host) {
      if ([false, null].includes(host)) {
        this.removeAttribute("host");
      } else if (host === true) {
        this.setAttribute("host", '');
      }
      this.#_.host = host
    }
  };
};
