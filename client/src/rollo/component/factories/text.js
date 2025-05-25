/* 
20250302 
src/rollo/component/factories/text.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/text.js
import { text } from "rollo/component/factories/text.js";
*/

export const text = (parent, config, ...factories) => {
  return class extends parent {
    static name = "text";

    get text() {
      return this.textContent || null;
    }
    set text(text) {
      this.textContent = text;
    }
  };
};
