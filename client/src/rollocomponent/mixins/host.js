/*
import host from "@/rollocomponent/mixins/host.js";
20250601
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
    }

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

    __new__() {
      super.__new__?.();

      /* Call setup on descendants */
        if (this.hasAttribute('host')) {
          this
            .querySelectorAll(`[setup]`)
            .values()
            .forEach((c) => {
              c.setup.call(c, c);
            });
        }
    }
  };
};
