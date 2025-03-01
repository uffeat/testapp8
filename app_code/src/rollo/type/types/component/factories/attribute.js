import { camel_to_kebab } from "@/rollo/tools/text/case";

export const attribute = (parent, config, ...factories) => {
  const ATTRIBUTE = config.ATTRIBUTE;

  return class extends parent {
    static name = "attribute";

    get attribute() {
      return this.#attribute;
    }
    #attribute = new Proxy(this, {
      get(target, name) {
        return target.getAttribute(camel_to_kebab(name));
      },
      set(target, name, value) {
        if (value === undefined) return true;
        name = camel_to_kebab(name);
        if (value === false || value === null) {
          target.removeAttribute(name);
        } else if (value === true) {
          target.setAttribute(name, "");
        } else {
          target.setAttribute(name, value);
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
          this.attribute[k.slice(ATTRIBUTE.length)] = v
          
        });
      return this;
    }
  };
};
