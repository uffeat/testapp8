import { camel_to_kebab } from "rollo/utils/case";

/* . */
export const media_rule = (parent, config, ...factories) => {
  const cls = class MediaRule extends parent {
    #rule;
    #sheet;
    #selector;

    constructor({ sheet, selector, ...updates }) {
      super();
      this.#sheet = sheet;
      this.#selector = selector;
      const index = sheet.insertRule(`${selector} {}`, sheet.cssRules.length);
      this.#rule = sheet.cssRules[index];
      this.update(updates);
    }

    get rule() {
      return this.#rule;
    }

    get selector() {
      return this.#selector;
    }

    get sheet() {
      return this.#sheet;
    }

    /*  */
    update(updates = {}) {
      super.update && super.update(updates);

      for (const [key, items] of Object.entries(updates)) {
        if (items === undefined) {
          continue;
        }
        if (key in this) {
          continue;
        }

        
        for (const [key, value] of Object.entries(items)) {
          if (!this.#is_css(key)) {
            throw new Error(`Invalid key: ${key}`);
          }
          /*
          TODO
          Consider, if false value should be a cue to delete declaration (item)
          */
          if (value.endsWith("!important")) {
            this.rule.style.setProperty(
              key,
              value.slice(0, -"!important".length).trim(),
              "important"
            );
          } else {
            this.rule.style.setProperty(camel_to_kebab(key), value);
          }
        }
      }
      return this;
    }

    #is_css = (key) => {
      return (key) =>
        typeof key === "string" &&
        (key.startsWith("--") ||
          key in this.style);
    };
  };
  return cls;
};
