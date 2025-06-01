/*
import host from "@/rollocomponent/mixins/host.js";
20250530
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
    }

    /* Returns 'host'. */
    get host() {
      if (this.#_.host) {
        return this.#_.host;
      }

      return this.closest("[host]");
    }

    /* Sets component's 'host' status. */
    set host(host) {
      /* Own host */
      if (host === true) {
        this.setAttribute("host", "");
        this.#_.host = this;
        return;
      }

      /* No explicit host */
      if (!host) {
        this.removeAttribute("host");
        this.#_.host = null;
      }

      /* Explicit host */
      this.#_.host = host;
      if (host.key) {
        this.setAttribute("host", host.key);
      } else {
        this.removeAttribute("host");
      }
      



    }
  };
};
