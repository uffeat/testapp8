import { constants } from "rollo/constants";
import { camel_to_kebab } from "rollo/utils/case";

/* Base factory for all web components. */
export const attribute = (parent, config, ...factories) => {
  const cls = class Attribute extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Getter/setter interface to attributes. */
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

    update(updates = {}) {
      super.update && super.update(updates);
      /* Update attributes. */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.ATTRIBUTE))
        .forEach(
          ([key, value]) =>
            (this.attribute[key.slice(constants.ATTRIBUTE.length)] = value)
        );
      return this;
    }
  };
  return cls;
};
