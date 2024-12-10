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

/* Non-visual web component for controlling CSS rules of parent component's sheet. */
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
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      this.style.display = "none";
      /* */
      if (!this.selector) {
        throw new Error(`'selector' not set.`);
      }
      /* Add connect-effect to control rule in target sheet */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.#target = this.parentElement;
          if (!this.#target.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create an add rule without items */
          this.#rule = this.#target.rules.add(`${this.selector} {}`);
        } else {
          /* Delete rule in target
          NOTE If target has been disconnected, it has no rule; therefore check */
          if (this.#target.rules) {
            this.#target.rules.remove(this.#rule);
          }
          /* Reset */
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
