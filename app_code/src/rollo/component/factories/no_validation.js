/* 
202503018
src/rollo/component/factories/no_validation.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/no_validation.js
import { no_validation } from "rollo/component/factories/no_validation.js";
*/
export const no_validation = (parent, config, ...factories) => {
  return class extends parent {
    static name = "no_validation";

    get noValidation() {
      return this.getAttribute("for");
    }
    set noValidation(noValidation) {
      if (noValidation) {
        this.setAttribute("novalidation", '');
      } else {
        this.removeAttribute("novalidation");
      }
    }
  };
};
