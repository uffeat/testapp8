/*
import host from "@/rollocomponent/mixins/host.js";
20250601
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};

    /* Returns 'host'. */
    get host() {
      return this.closest("[host]");
    }

    /* Sets component's 'host' status. */
    set host(host) {
      this.#_.host = host;
      if (host) {
        this.setAttribute("host", "");
      } else {
        this.removeAttribute("host");
      }
    }

    /* Calls '__setup__' on descendants, if component is host. */
    __init__() {
      super.__init__?.();
      if (this.hasAttribute("host")) {
        this.querySelectorAll(`[setup]`)
          .values()
          .forEach((c) => {
            c.__setup__.call(c, this);
          });
      }
    }
  };
};
