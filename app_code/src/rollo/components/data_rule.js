import { Component, create } from "rollo/component";
import { camel_to_kebab } from "rollo/utils/case";
import { attribute, name } from "rollo/factories/__factories__";

export const data_rule = (parent, config, ...factories) => {
  const cls = class DataRule extends parent {
    #rule;
    #selector;
    #sheet;
    constructor() {
      super();
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

    init(selector, sheet) {
      if (this.#sheet) {
        throw new Error(`Component has already been initialized.`);
      }
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

    update({ selector, sheet, ...updates } = {}) {
      if (selector || sheet) {
        this.init(selector, sheet);
      }

      if (!this.#sheet) {
        throw new Error(`Component not initialized.`);
      }

      super.update && super.update(updates);

      for (const [key, value] of Object.entries(updates)) {
        if (key in this) {
          continue;
        }
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
      return this;
    }

    #is_css = (key) => {
      return (
        typeof key === "string" && (key.startsWith("--") || key in this.style)
      );
    };
  };

  return cls;
};

Component.author("data-rule", HTMLElement, {}, attribute, name, data_rule);

export const data_media_rule = (parent, config, ...factories) => {
  const cls = class DataMediaRule extends parent {
    constructor() {
      super();
    }

    update(updates = {}) {
      super.update(
        Object.fromEntries(
          Object.entries(updates).filter(([key, value]) => key in this)
        )
      );

      for (const [selector, items] of Object.entries(updates)) {
        if (selector in this) {
          continue;
        }
        if (items === undefined) {
          continue;
        }
        create("data-rule", {
          selector,
          sheet: this.rule,
          ...items,
        });
      }
      return this;
    }
  };
  return cls;
};

Component.author(
  "data-media-rule",
  HTMLElement,
  {},
  attribute,
  name,
  data_rule,
  data_media_rule
);

export const data_keyframes_rule = (parent, config, ...factories) => {
  const cls = class DataKeyframesRule extends parent {
    constructor() {
      super();
    }

    update(updates = {}) {
      super.update(
        Object.fromEntries(
          Object.entries(updates).filter(([key, value]) => key in this)
        )
      );

      for (const [selector, items] of Object.entries(updates)) {
        if (selector in this) {
          continue;
        }
        if (items === undefined) {
          continue;
        }
        //
        //this.rule.style.removeProperty(selector);
        //
        const text = `${selector} { ${Object.entries(items)
          .map(([selector, value]) => `${camel_to_kebab(selector)}: ${value};`)
          .join(" ")} }`;
        this.rule.appendRule(text);
      }
    }
  };
  return cls;
};

Component.author(
  "data-keyframes-rule",
  HTMLElement,
  {},
  attribute,
  name,
  data_rule,
  data_keyframes_rule
);
