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
  state_to_native,
  tags,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for controlling CSS rules of parent component's sheet. 


TODO

Mention use with/without dom connection
Mention state_to_native re selector



*/
const css_rule = (parent) => {
  const cls = class CssRule extends parent {
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
      super.style.display = "none";

      /* Add effect to handle selector */
      this.effects.add((data) => {
        if (this.rule) {
          /* Update rule */
          this.rule.selectorText = this.selector;
        }
        /* Sync to attribute */
        this.attribute.selector = this.selector;
        
      }, "selector");

      /* Add effect to handle target */
      this.effects.add((data) => {
        const current = data.target.current;
        const previous = data.target.previous;
        if (previous) {
          previous.rules && previous.rules.remove(this.rule);
          this.#rule = null;
        }
        if (current) {
          if (!current.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create and add rule without items */
          this.#rule = current.rules.add(`${this.selector}`);
        }
      }, "target");

      /* Add connect-effect to set target from live DOM */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.target = this.parentElement;
        } else {
          this.target = null;
        }
      }, "connected");
    }

    /* Returns rule. */
    get rule() {
      return this.#rule;
    }
    #rule;

    /* Returns selector. */
    get selector() {
      return this.#selector;
    }
    /* Sets selector. */
    set selector(selector) {
      /* Abort, if no change */
      if (this.#selector === selector) {
        return;
      }
      /* Sync to attribute */
      this.attribute.selector = selector;
      /* Update private */
      this.#selector = selector;
      if (this.rule) {
        /* Update rule */
        this.rule.selectorText = selector;
      }
    }
    #selector = "*";

    /* Returns target. */
    get target() {
      return this.$.target;
    }
    /* Sets target and rule. */
    set target(target) {
      this.$.target = target;
    }

    /* Returns text representation of rule. */
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
  state_to_native,
  tags,
  uid,
  css_rule
);
