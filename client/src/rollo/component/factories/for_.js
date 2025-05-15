/* 
20250302 
src/rollo/component/factories/for_.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/for_.js
import { for_ } from "rollo/component/factories/for_.js";
*/
export const for_ = (parent, config, ...factories) => {
  return class extends parent {
    static name = "for_";

    get for_() {
      return this.getAttribute("for");
    }
    set for_(for_) {
      if (for_) {
        this.setAttribute("for", for_);
      } else {
        this.removeAttribute("for");
      }
    }
  };
};
