/* 
20250302 
src/rollo/component/factories/name.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/name.js
import { name } from "rollo/component/factories/name.js";
*/
export const name = (parent, config, ...factories) => {
  return class extends parent {
    static name = "name";

    #name = null;

    get name() {
      return this.#name;
    }
    set name(name) {
      if (name) {
        this.setAttribute("name", name);
      } else {
        this.removeAttribute("name");
      }
      this.#name = name;
    }
  };
};
