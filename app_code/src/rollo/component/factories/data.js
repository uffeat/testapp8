/* 
20250421
src/rollo/component/factories/data.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/data.js
import { data } from "rollo/component/factories/data.js";
*/

const { camel_to_kebab } = await modules.get("@/rollo/tools/text/case.js");
const { constants } = await modules.get("@/rollo/component/tools/constants.js");

const { DATA } = constants;

export const data = (parent, config, ...factories) => {
  return class extends parent {
    static name = "data";

    #data;

    constructor() {
      super();
      this.#data = new Proxy(this, {
        get(target, k) {
          return target.getAttribute(create_key(k));
        },
        set(target, k, v) {
          if (v === undefined) return true;
          k = create_key(k);
          if ([false, null].includes(v)) {
            target.removeAttribute(k);
          } else if (v === true) {
            target.setAttribute(k, "");
          } else {
            target.setAttribute(k, v);
          }
          return true;
        },
      });
    }

    /* Returns object, from which dataset item can be retrieved/set. 
    NOTE
    - In contast to native 'dataset',
      - true set value-less attribute
      - null or false removes attribute */
    get data() {
      return this.#data;
    }

    /* Updates dataset. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(DATA))
        .forEach(([k, v]) => {
          this.data[k.slice(DATA.length)] = v;
        });
      return this;
    }
  };
};

function create_key(k) {
  return `data-${camel_to_kebab(k)}`;
}
