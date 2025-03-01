// import { validate } from "@/rollo/tools/sheet/tools/validate";
// const { validate } = await import("@/rollo/tools/sheet/tools/validate");

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


