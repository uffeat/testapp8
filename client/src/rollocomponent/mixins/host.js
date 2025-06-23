/*
import host from "@/rollocomponent/mixins/host.js";
20250601
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "host";
    #_ = {};

    /* Returns 'host'. */
    get host() {
      if (this.#_.host && this.#_.host instanceof HTMLElement) {
        return this.#_.host
      }
      return this.closest("[host]");
    }

    /* Sets component's 'host' status. */
    set host(host) {
      this.#_.host = host;
      if (host === true) {
        this.setAttribute("host", "");
      } else {
        this.removeAttribute("host");
      }
    }

    /* Calls '__setup__' on descendants, if component is host. */
    __init__() {
      super.__init__?.();
      if (this.#_.host === true) {
        this.querySelectorAll(`[setup]`)
          .values()
          .forEach((component) => {
            component.__setup__.call(component, this);
          });
      }
    }
  };
};
