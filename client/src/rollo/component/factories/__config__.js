/* 
20250302 
src/rollo/component/factories/for_.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/for_.js
import { for_ } from "rollo/component/factories/for_.js";
*/
export const __config__ = (parent, config, ...factories) => {
  return class extends parent {
    static name = "__config__";

    #__config__

    constructor() {
      super()
      this.#__config__ = {}

    }

    get __config__() {
      return this.#__config__;
    }
    
  };
};
