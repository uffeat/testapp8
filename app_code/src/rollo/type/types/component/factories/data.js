import { camel_to_kebab } from "@/rollo/tools/text/case";

export const data = (parent, config, ...factories) => {
  const DATA = config.DATA;

  return class extends parent {
    static name = "data";

    get data() {
      return this.#data;
    }
    #data = new Proxy(this, {
      get(target, name) {
        return target.getAttribute(create_name(name));
      },
      set(target, name, value) {
        if (value === undefined) return true;
        name = create_name(name);
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

function create_name(name) {
  return `data-${camel_to_kebab(name)}`;
}
