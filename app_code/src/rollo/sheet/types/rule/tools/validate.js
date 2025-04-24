/* 
20250302 
src/rollo/sheet/types/rule/tools/validate.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rule/tools/validate.js
import { validate } from "@/rollo/tools/sheet/tools/validate.js";
const { validate } = await import("@/rollo/tools/sheet/tools/validate.js");
*/

export const validate = (key) => {
  return key in validator.style || key.startsWith("--");
};

class Validator extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define("style-validator-component", Validator);
const validator = new Validator();


