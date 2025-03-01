import { camel_to_kebab } from "@/rollo/tools/text/case";
import { constants } from "@/rollo/component/tools/constants";

const { ATTRIBUTE } = constants;

export const attribute = (parent, config, ...factories) => {
  return class extends parent {
    static name = "attribute";

    get attribute() {
      return this.#attribute;
    }
    #attribute = new Proxy(this, {
      get(target, k) {
        return target.getAttribute(camel_to_kebab(k));
      },
      set(target, k, v) {
        if (v === undefined) return true;
        k = camel_to_kebab(k);
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

    /* Updates attributes. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);
      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(ATTRIBUTE))
        .forEach(([k, v]) => {
          this.attribute[k.slice(ATTRIBUTE.length)] = v;
        });
      return this;
    }
  };
};
