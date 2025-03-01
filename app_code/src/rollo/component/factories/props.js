import { constants } from "@/rollo/component/tools/constants";

const { ARIA, CSS_VAR } = constants;

export const props = (parent, config, ...factories) => {
  return class extends parent {
    static name = "props";

    /* Updates accessor props. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);

      Object.entries(updates)
        .filter(
          ([k, v]) => k in this || (k.startsWith("_") && !k.startsWith(CSS_VAR))
        )
        .forEach(([k, v]) => (this[k] = v));

      return this;
    }
  };
};
