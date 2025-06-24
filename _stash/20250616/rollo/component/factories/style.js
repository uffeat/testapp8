/* 
20250405
src/rollo/component/factories/style.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/style.js
import { style } from "rollo/component/factories/style.js";
*/

export const style = (parent, config, ...factories) => {
  return class extends parent {
    static name = "style";

    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(([k, v]) => k in this.style)
        .forEach(([k, v]) => {
          if (v === null) {
            v = 'none'
          }
          this.style[k] = v;
        });
      return this;
    }
  };
};
