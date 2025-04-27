/* 
20250421
src/rollo/component/factories/attribute.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/attribute.js
import { attribute } from "rollo/component/factories/attribute.js";
*/


import { camel_to_kebab } from "@/rollo/tools/text/case.js";
//const { camel_to_kebab } = await modules.get("@/rollo/tools/text/case.js");
import { constants } from "@/rollo/component/tools/constants.js";
//const { constants } = await modules.get("@/rollo/component/tools/constants.js");


const { ATTRIBUTE } = constants;

export const attribute = (parent, config, ...factories) => {
  return class extends parent {
    static name = "attribute";

    #attribute;

    __new__() {
      super.__new__?.();
      this.#attribute = new Proxy(this, {
        get(target, name) {
          /* Normalize name; by convention, to kebab-case */
          name = camel_to_kebab(name);
          if (target.hasAttribute(name)) {
            const value = target.getAttribute(name);
            /* By convention, 
            - non-present attrs are interpreted as null
            - value-less attrs are interpreted as true
            - values that can be interpreted as numbers are interpreted as 
              numbers */
            const number = Number(value);
            return isNaN(number) ? value || true : number;
          }
          return null;
        },
        set(target, name, value) {
          /* By convention, undefined aborts. Allows use of ternaries and iife's */
          if (value === undefined) return true;
          /* Normalize key, by convention, to kebab-case */
          name = camel_to_kebab(name);
          /* Normalize string value */
          if (typeof value === "string") {
            value = value.trim();
          }
          const previous = target.attribute[name];
          /* Abort, if no change */
          if (value === previous) return true;
          if ([false, ""].includes(value) && previous === null) return true;
          /* By convention, false and null removes */
          if ([false, null].includes(value)) {
            target.removeAttribute(value);
          } else if (
            value === true ||
            !["number", "string"].includes(typeof value)
          ) {
            /* By convention, non-primitive values sets value-less attr */
            target.setAttribute(name, "");
          } else {
            target.setAttribute(name, value);
          }
          const detail = Object.freeze({ name, current: value, previous });
          /* NOTE
          - Stricltly speaking redundant to include name in the name-specific 
            event dispatch, but keeps things simple and consistent. */
          target.send(`attribute_${name}`, { detail });
          target.send("attribute", { detail });
          return true;
          /* NOTE
          - The fact that both false and null signals attr removal represents 
            a slight mismatch vis-a-vis the getter, where non-present attrs 
            are interpreted as null. However, in practice, this mismatch can
            also inspire leaner code and is therefore embraced.
          - The fact that non-primitive values result in a value-less attr 
            may seem odd, but is useful in practice and can inspire leaner code.
          */
        },
      });
    }

    get attribute() {
      return this.#attribute;
    }

    /* Updates attributes. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(([name, value]) => name.startsWith(ATTRIBUTE))
        .forEach(([name, value]) => {
          this.attribute[name.slice(ATTRIBUTE.length)] = value;
        });
      return this;
    }
  };
};
