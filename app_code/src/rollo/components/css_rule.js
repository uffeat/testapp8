import { Component } from "rollo/component";
import {
  attribute,
  connected,
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

      /*  */
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
          /*
          TODO
          - Remove rule from target's sheet. Ideas:
            - Loop over this.#target.sheet.cssRules to find index from this.selector;
              then go this.#target.sheet.deleteRule(index).
            - Let this.#target maintain a fast-lookup structure (perhaps a map) that 
              continually keeps track of the index-rule or index-selector relationship 
              (check if any native structures can help, e.g., item); then let this.#target
              expose a delete_rule method that can be called from here.
            - Use one of the above, but let this.#target do the work via an observer...
            - Do not allow rules to me removed (or remove, but warn). Could be a good solution, 
              if sheets are kept small and/or:
              - dynamic behaviour is provided by:
                - sheet.disable
                - controlling the rule from its child item components
          */
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
  hooks,
  name,
  properties,
  reactive,
  state_to_attribute,
  uid,
  css_rule
);
