/*
import components from "@/rollocomponent/mixins/components.js";
20250530
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "components";
    #_ = {};
    constructor() {
      super();
      this.#_.components = new Proxy(this, {
        get: (target, key) => target.querySelector(`[key="${key}"]`),
      });
    }

    /* Returns object, from which 'key'-descendants can be retieved. 
    NOTE Purely syntactical sugar; no caching. */
    get components() {
      return this.#_.components;
    }
  };
};
