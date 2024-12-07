import { camel_to_kebab } from "rollo/utils/case";
import { check_factories } from "rollo/utils/check_factories";
import { sheet } from "rollo/factories/__factories__";


class DataCssValidator extends HTMLElement {
  constructor() {
    super();
  }
}





const is_valid_key = (() => {
  const web_component = document.createElement("web-component");
  return (key) => {
    if (!key.startsWith("--")) {
      if (!(key in web_component.style)) {
        return false;
      }
      return true;
    }
  };
})();

class Rule {
  static create = (...args) => {
    return new Rule(...args);
  };
  #rule;
  #selector;
  #sheet;
  constructor(sheet, selector, items) {
    this.#sheet = sheet;
    this.#selector = selector;
    const index = sheet.insertRule(`${selector} {}`, sheet.cssRules.length);
    this.#rule = sheet.cssRules[index];
    if (items) {
      this.update(items);
    }
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
      if (is_valid_key(key) === false) {
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
}

class MediaRule extends Rule {
  constructor(sheet, selector, items) {
    /*TODO 
    auto-insert '@media' if needed
    perhaps extract logic
    
    */
    super(sheet, selector, items);
  }

  update(block = {}) {
    for (const [selector, items] of Object.entries(block)) {
      if (items === undefined) {
        continue;
      }
      /*
      TODO
      Consider if false should be a cue to delete declaration
      */
      new Rule(this.rule, selector, items);
    }
  }
}

class KeyframeRule extends Rule {
  constructor(sheet, selector, items) {
    /* TODO 
    auto-insert '@keyframes' if needed
    Extract name
    */
    super(sheet, selector, items);
  }

  update(block = {}) {
    for (const [selector, items] of Object.entries(block)) {
      if (items === undefined) {
        continue;
      }
      /*
      TODO
      Consider if false should be a cue to delete declaration
      */
      this.rule.style.removeProperty(selector);
      const text = `${key} { ${Object.entries(items)
        .map(([key, value]) => `${camel_to_kebab(key)}: ${value};`)
        .join(" ")} }`;
      this.rule.appendRule(text);
    }
  }
}

/* . */
export const rules = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([sheet], factories);

  const cls = class Rules extends parent {
    /* Handles hooks. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - after 'update' 
    - before 'created_callback'
    - before live DOM connection */
    call(...hooks) {
      /* TODO
      Consider, if this should be done last?
      */
      super.call && super.call(...hooks);

      // Refactor to array methods

      /* Ignore undefined to support iife's */
      hooks = hooks.filter((hook) => hook);

      for (const hook of hooks) {
        for (const [selector, items] of Object.entries(hook)) {
          if (selector.startsWith("@media")) {
            new MediaRule(this.sheet, selector, items);
            continue;
          }
          if (selector.startsWith("@keyframes")) {
            new KeyframeRule(this.sheet, selector, items);
            continue;
          }
          new Rule(this.sheet, selector, items);
        }
      }
      return this;
    }
  };
  return cls;
};
