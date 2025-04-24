/* 
20250302 
src/rollo/sheet/types/rule/factories/text.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rule/factories/text.js
*/
import { truncate } from "@/rollo/tools/text/truncate.js";

export const text = (parent, config, ...factories) => {
  return class extends parent {
    static name = "text";

    /* Returns text representation of css rule. */
    text(pretty = true) {
      return pretty ? this.rule.cssText : truncate(this.rule.cssText);
    }
  };
};
