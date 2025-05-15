/* 
20250302 
src/rollo/component/factories/props.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/props.js
import { props } from "rollo/component/factories/props.js";
*/

import { constants } from "@/rollo/component/tools/constants.js";
//const { constants } = await modules.get("@/rollo/component/tools/constants.js");

const { CSS_VAR } = constants;

export const props = (parent, config, ...factories) => {
  return class extends parent {
    static name = "props";

    /* Updates accessor props. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(
          ([k, v]) => k in this || (k.startsWith("_") && !k.startsWith(CSS_VAR))
        )
        .forEach(([k, v]) => (this[k] = v));
      return this;
    }
  };
};
