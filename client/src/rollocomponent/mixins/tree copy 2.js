/*
import tree from "@/rollocomponent/mixins/tree.js";
20250623
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "tree";

    #_ = {
      _: {},
      tree: {},
    };

    constructor() {
      super();
      const owner = this;

      const build = (...args) => {
        const children = args.filter((a) => a instanceof HTMLElement);
        const hooks = args.filter((a) => typeof a === "function");

        owner.append(...children);
        for (const component of owner.querySelectorAll(`[key]`)) {
          owner.#_.tree[component.getAttribute("key")] = component;
          if ("host" in component) {
            component.host = owner;
          }
        }

        for (const component of owner.querySelectorAll(`[setup]`)) {
          component.__setup__.call(component, owner);
        }

        for (const hook of hooks) {
          hook.call(owner);
        }

        return owner;
      };

      this.#_._.tree = new Proxy(() => {}, {
        get: (_, key) => owner.#_.tree[key],
        apply: (_, __, args) => build(...args),
      });
    }

    /* Returns tree. */
    get tree() {
      return this.#_._.tree;
    }

    
  };
};
