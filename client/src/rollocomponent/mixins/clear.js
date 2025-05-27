/*
import clear from "@/rollocomponent/mixins/clear.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    /* Clears content, optionally subject to selector. Chainable. */
    clear(selector) {
      if (selector) {
        const result = this.find(selector);
        if (Array.isArray(result)) {
          result.forEach((e) => e.remove());
        } else if (result instanceof HTMLElement) {
          result.remove();
        }
      } else {
        /* Remove child elements in a memory-safe way. */
        while (this.firstElementChild) {
          this.firstElementChild.remove();
        }
        /* Remove any residual text nodes */
        this.innerHTML = "";
      }
      return this;
    }
  };
};
