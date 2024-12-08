import { Component } from "rollo/component";
import { camel_to_kebab } from "rollo/utils/case";

/* Non-visual web component for dynamic rules. */
const data_rule = (parent) => {
  const cls = class DataRule extends parent {
    #rule;
    #selector;
    #sheet;
    constructor(sheet, selector, items) {
      super();
      this.#sheet = sheet;
      this.#selector = selector;
      const index = sheet.insertRule(`${selector} {}`, sheet.cssRules.length);
      this.#rule = sheet.cssRules[index];
      if (items) {
        this.update(items);
      }
    }

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      this.style.display = "none";
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

    update(items = {}) {
      for (const [key, value] of Object.entries(items)) {
        if (value === undefined) {
          continue;
        }
        /*
        TODO
        Consider if false should be a cue to delete declaration
        */
        if (!this.#is_css(key)) {
          throw new Error(`Invalid key: ${key}`);
        }
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

    #is_css = (key) => {
      return (key) =>
        typeof key === "string" && (key.startsWith("--") || key in this.style);
    };
  };

  return cls;
};

Component.author("data-rule", HTMLElement, {}, data_rule);
