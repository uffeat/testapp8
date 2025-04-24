/* 
20250302 
src/rollo/component/factories/parent.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/parent.js
import { parent } from "rollo/component/factories/parent.js";
*/
export const parent = (parent, config, ...factories) => {
  return class extends parent {
    static name = "parent";

    get parent() {
      return this.parentElement;
    }
    set parent(parent) {
      if (parent) {
        if (parent !== this.parentElement) {
          parent.append(this)
        }
      } else {
        this.remove()
      }
    }
   
  };
};
