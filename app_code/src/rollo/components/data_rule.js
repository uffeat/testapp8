import { Component, create } from "rollo/component";
import { camel_to_kebab } from "rollo/utils/case";

export const data_rule = (parent, config, ...factories) => {
  const cls = class DataRule extends parent {
    #rule;
    #selector;
    #sheet;
    constructor() {
      super();
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

    update({ selector, sheet, ...items } = {}) {
      if (this.#sheet) {
        if (selector) {
          throw new Error(`'selector' already set.`);
        }
        if (sheet) {
          throw new Error(`'sheet' already set.`);
        }
      } else {
        if (!selector) {
          throw new Error(`'selector' not specified.`);
        }
        if (!sheet) {
          throw new Error(`'sheet' not specified.`);
        }
        this.#sheet = sheet;
        this.#selector = selector;
        const index = sheet.insertRule(`${selector} {}`, sheet.cssRules.length);
        this.#rule = sheet.cssRules[index];
      }

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

export const DataRule = Component.get("data-rule");

export const data_media_rule = (parent, config, ...factories) => {
  const cls = class DataMediaRule extends parent {
    constructor() {
      super();
    }

    update({ selector, sheet, ...block } = {}) {
      super.update({ selector, sheet });

      for (const [selector, items] of Object.entries(block)) {
        if (items === undefined) {
          continue;
        }
        

        
        create("data-rule", {
          selector,
          sheet: this.rule,
          ...items
        })
          
      }
    }
  };
  return cls;
};

Component.author("data-media-rule", DataRule, {}, data_media_rule);

export const DataMediaRule = Component.get("data-media-rule");

