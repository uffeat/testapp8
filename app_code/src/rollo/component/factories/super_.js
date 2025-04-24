/* 
20250304
src/rollo/component/factories/super_.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/super_.js
import { super_ } from "rollo/component/factories/super_.js";
*/
export const super_ = (parent, config, ...factories) => {
  return class extends parent {
    static name = "super_";

    #super_;

    __new__() {
      super.__new__?.();

      const get_super = (key) => {
        return super[key];
      };

      const set_super = (key, value) => {
        super[key] = value;
      };

      this.#super_ = new Proxy(this, {
        get(target, key) {
          return get_super(key);
        },
        set(target, key, value) {
          set_super(key, value);
          return true;
        },
      });
    }

    /* Returns object, from which super items can be retrived/set. */
    get super_() {
      return this.#super_;
    }
  };
};
