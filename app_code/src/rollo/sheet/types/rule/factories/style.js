import { camel_to_kebab } from "@/rollo/tools/text/case";
import { validate } from "@/rollo/sheet/types/rule/tools/validate";

export const style = (parent, config, ...factories) => {
  return class extends parent {
    static name = "style";

    #items = Object.freeze({});

    __new__() {
      super.__new__ && super.__new__();
    }

    /* Returns object representation of updated items.*/
    items() {
      return this.#items;
    }

    /* Removes all items. Chainable. */
    clear() {
      this.update(Object.entries(this.items).map(([k, v]) => [k, undefined]));
      return this;
    }

    /* Updates rule. Chainable.
      NOTE
      - undefined item value removes item.
      - Invalid item keys are ignored, but triggers warning. */
    update(items = {}) {
      if (Array.isArray(items)) {
        items = Object.fromEntries(items);
      }
      const style = this.rule.style;
      for (const [_key, _value] of Object.entries(items)) {
        /* Case-convert key */
        const key = _key.startsWith("--") ? _key : camel_to_kebab(_key.trim());
        /* Ignore invalid keys */
        if (!validate(key)) {
          console.warn("Ignored invalid key:", key); ////
          continue;
        }
        /* undefined -> cue to remove */
        if (_value === undefined) {
          if (key in this.__dict__.current) {
            style.removeProperty(key);
            /* Update current */
            delete this.__dict__.current[key];
          }
        } else {
          /* Ensure that value is a string */
          const value = _value === null ? "none" : String(_value);
          if (this.__dict__.current[key] !== value) {
            /* Update rule */
            if (value.endsWith("!important")) {
              style.setProperty(
                key,
                value.slice(0, -"!important".length),
                "important"
              );
            } else {
              style.setProperty(key, value);
            }
            /* Update current */
            this.__dict__.current[key] = value;
          }
        }
      }
      /* Update items */
      this.#items = Object.freeze({ ...this.__dict__.current });
      return this;
    }
  };
};
