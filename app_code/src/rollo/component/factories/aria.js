import { camel_to_kebab } from "@/rollo/tools/text/case";
import { constants } from "@/rollo/component/tools/constants";

const { ARIA } = constants;

export const aria = (parent, config, ...factories) => {
  return class extends parent {
    static name = "aria";

   
    

   

    /* Updates aria props/attributes. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);
      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(ARIA))
        .forEach(([k, v]) => {
          if (v) {
            this[k] = v
          } else {
            this.removeAttribute(camel_to_kebab(k))
          }
         
        });
      return this;
    }
  };
};
