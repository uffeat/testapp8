import { Data } from "rollo/types/data";
import { camel_to_kebab } from "rollo/utils/case";

/* Factory for enhanced attribute control. */
export const attribute = (parent, config, ...factories) => {
  const cls = class Attribute extends parent {
    static PREFIX = "attribute_";

    /* Returns prop-like getter/setter interface to attribute. 
    Supports:
    - camel case
    - hooks
    - iife's (undefined values are ignored) */
    get attribute() {
      return this.#attribute;
    }
    #attribute = new Proxy(this, {
      get(target, key) {
        key = camel_to_kebab(key);
        if (!target.hasAttribute(key)) {
          return null;
        }
        const value = target.getAttribute(key);
        if (value === "") {
          return true;
        }
        const number = Number(value);
        if (typeof number === "number" && number === number) {
          return number;
        }
        return value;
      },
      set(target, key, value) {
        if (typeof value === "function") {
          value = value.call(target);
        }
        if (value === undefined) return true;
        key = camel_to_kebab(key);
        if ([false, null].includes(value)) {
          /* Remove attr */
          target.removeAttribute(key);
          return true;
        }
        if (["", true].includes(value)) {
          /* Set no-value attr */
          target.setAttribute(key, "");
          return true;
        }
        /* Set value attr */
        if (!["number", "string"].includes(typeof value)) {
          throw new Error(`Invalid attr value: ${value}`);
        }
        target.setAttribute(key, value);
        return true;
      },
    });

    /* Updates component. Chainable. */
    update(updates) {
      super.update && super.update(updates);




      /* Update attributes */
      Data.create(updates)
        .filter(
          ([k, v]) => typeof k === "string" && k.startsWith(Attribute.PREFIX)
        )
        .map(([k, v]) => [k.slice(Attribute.PREFIX.length), v])
        .forEach(([k, v]) => (this.attribute[k] = v));
      return this;
    }
  };
  return cls;
};
