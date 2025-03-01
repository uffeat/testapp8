import { camel_to_kebab } from "@/rollo/tools/text/case";
import { constants } from "@/rollo/component/tools/constants";

const { DATA } = constants;

export const data = (parent, config, ...factories) => {
  

  return class extends parent {
    static name = "data";

    get data() {
      return this.#data;
    }
    #data = new Proxy(this, {
      get(target, k) {
        return target.getAttribute(create_key(k));
      },
      set(target, k, v) {
        if (v === undefined) return true;
        k = create_key(k);
        if (v === false || v === null) {
          target.removeAttribute(k);
        } else if (v === true) {
          target.setAttribute(k, "");
        } else {
          target.setAttribute(k, v);
        }
        return true;
      },
    });

    /* Updates dataset. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);

      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(DATA))
        .forEach(([k, v]) => {
          this.data[k.slice(DATA.length)] = v
        });
        
      return this;
    }
  };
};

function create_key(k) {
  return `data-${camel_to_kebab(k)}`;
}
