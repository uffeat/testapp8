/* 
20250302 
src/rollo/component/factories/value.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/value.js
import { value } from "rollo/component/factories/value.js";
*/

export const value = (parent, config, ...factories) => {
  return class extends parent {
    static name = "value";

    #value;

    get value() {
      return this.#value;
    }
    set value(value) {
      if (value === true) {
        this.setAttribute("value", "");
      } else if (["number", "string"].includes(typeof value)) {
        this.setAttribute("value", value);
      } else {
        this.removeAttribute("value");
      }
      this.#value = value;
    }
  };
};
