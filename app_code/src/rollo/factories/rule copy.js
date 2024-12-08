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

    get selector() {
      return this.#selector;
    }

    set selector(selector) {
      if (this.#selector) {
        throw new Error(`'selector' cannot be changed.`);
      }
      this.#selector = selector;
    }

    get sheet() {
      return this.#sheet;
    }

    set sheet(sheet) {
      if (this.#sheet) {
        throw new Error(`'sheet' cannot be changed.`);
      }
      if (!this.selector) {
        throw new Error(`'selector' not specified.`);
      }
      this.#sheet = sheet;
      const index = sheet.insertRule(
        `${this.selector} {}`,
        sheet.cssRules.length
      );
      this.#rule = sheet.cssRules[index];
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

    update({ selector, sheet, ...updates } = {}) {
      if (selector) {
        this.selector = selector;
      }
      if (sheet) {
        this.sheet = sheet;
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
