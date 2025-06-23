/*
import tree from "@/rollocomponent/mixins/tree.js";
20250623
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "tree";

    #_ = {
     
    };

    constructor() {
      super();
      

      const registry = {}

      this.#_.tree = new Proxy(() => {}, {
        get: (_, key) => registry[key],
        set: (_, key, value) =>{ 
          registry[key] = value
          return true
        },
        apply: (_, __, args) => {
          const children = args.filter((a) => a instanceof HTMLElement);
          const hooks = args.filter((a) => typeof a === "function");

          this.append(...children);
          for (const component of this.querySelectorAll(`[key]`)) {
            registry[component.getAttribute("key")] = component;
            if ("host" in component) {
              component.host = this;
            }
          }

          for (const component of this.querySelectorAll(`[setup]`)) {
            component.__setup__.call(component, this);
          }

          for (const hook of hooks) {
            hook.call(this);
          }

          return this;
        },
      });
    }

    /* Returns tree. */
    get tree() {
      return this.#_.tree;
    }
  };
};
