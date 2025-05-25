/* 
20250302 
src/rollo/component/factories/tab.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/tab.js
import { tab } from "rollo/component/factories/tab.js";
*/

export const tab = (parent, config, ...factories) => {
  return class extends parent {
    static name = "tab";

    get tabIndex() {
      return this.getAttribute("tabindex");
    }
    set tabIndex(tabindex) {
      if ([false, null].includes(tabindex)) {
        this.removeAttribute("tabindex");
      } else {
        this.setAttribute("tabindex", tabindex);
      }
    }
  };
};
