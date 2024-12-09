import { Component } from "rollo/component";
import {
  attribute,
  connected,
  descendants,
  hooks,
  name,
  properties,
  reactive,
  state_to_attribute,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for managing dynamically applied sheets. */
const css_rule = (parent) => {
  const cls = class CssRule extends parent {
    #rule;
    #selector;
    #target;
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
      /* */
      if (!this.selector) {
        throw new Error(`'selector' not set.`);
      }
      /* Add connect-effect to control rule in target sheet */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.#target = this.parentElement;
          if (!this.#target.sheet) {
            throw new Error(`Target does not have a sheet.`);
          }
          /* Create an add rule without items */
          const index = this.#target.sheet.insertRule(
            `${this.selector} {}`,
            this.#target.sheet.cssRules.length
          );
          this.#rule = this.#target.sheet.cssRules[index];
        } else {
          /* Find and delete rule in target sheet */
          for (const [index, rule] of [
            ...this.#target.sheet.cssRules,
          ].entries()) {
            if (rule === this.#rule) {
              this.#target.sheet.deleteRule(index);
              break;
            }
          }
          this.#rule = null;
          this.#target = null;
        }
      }, "connected");
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
      this.attribute.selector = selector;
    }

    get target() {
      return this.#target;
    }

    get text() {
      if (this.rule) {
        return this.rule.cssText;
      }
    }
  };

  return cls;
};

Component.author(
  "css-rule",
  HTMLElement,
  {},
  attribute,
  connected,
  descendants,
  hooks,
  name,
  properties,
  reactive,
  state_to_attribute,
  uid,
  css_rule
);
