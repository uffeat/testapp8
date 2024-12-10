/*
TODO
Reactive items
*/

import { camel_to_kebab } from "rollo/utils/case";
import { check_factories } from "rollo/utils/check_factories";
import {
  attribute,
  connected,
  properties,
  reactive,
  state_to_attribute,
} from "rollo/factories/__factories__";

/* . */
export const rule = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories(
    [attribute, connected, properties, reactive, state_to_attribute],
    factories
  );

  const cls = class Rule extends parent {
    #rule;
    #selector;
    #sheet;
    constructor() {
      super();
    }

    get rule() {
      return this.#rule;
    }

    #create_rule = () => {
      if (this.#rule) {
        throw new Error(`'rule' cannot be changed.`);
      }
      if (!this.selector) {
        throw new Error(`'selector' not set.`);
      }
      if (!this.sheet) {
        throw new Error(`'sheet' not set.`);
      }
      const index = this.sheet.insertRule(
        `${this.selector} {}`,
        this.sheet.cssRules.length
      );
      this.#rule = this.sheet.cssRules[index];
    };

    get selector() {
      return this.#selector;
    }

    set selector(selector) {
      if (this.#selector) {
        throw new Error(`'selector' cannot be changed.`);
      }
      this.#selector = selector;
      if (this.#selector && this.#sheet) {
        this.#create_rule();
      }
    }

    get sheet() {
      return this.#sheet;
    }

    set sheet(sheet) {
      if (this.#sheet) {
        throw new Error(`'sheet' cannot be changed.`);
      }
      this.#sheet = sheet;
      if (this.#selector && this.#sheet) {
        this.#create_rule();
      }
    }

    get text() {
      if (this.rule) {
        return this.rule.cssText
      }
    }

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      this.style.display = "none";

      /* Set/unset sheet on connect/disconnect */
      this.effects.add((data) => {
        if (this.$.connected) {
          if (!this.parentElement.sheet) {
            throw new Error(`Parent element does not have a sheet.`);
          }

          this.sheet = this.parentElement.sheet;
        } else {
          this.#sheet = null;
          /* 
          TODO
          - Perphas more clean-up? 
          */
        }
      }, "connected");
    }

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates = {}) {
      super.update && super.update(updates);

      for (const [key, value] of Object.entries(updates)) {
        if (key in this) {
          continue;
        }
        if (value === undefined) {
          continue;
        }

        if (typeof value !== "string") {
          /* Allow selector and items to be set in one go */
          this.update({ selector: key, ...value });
          continue;
        }

        /*
        TODO
        Consider if false should be a cue to delete declaration
        */
        if (!this.#is_css(key)) {
          throw new Error(`Invalid key: ${key}`);
        }

        if (!this.rule) {
          throw new Error(`'rule' not set.`);
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
