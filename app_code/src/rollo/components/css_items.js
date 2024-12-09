import { camel_to_kebab } from "rollo/utils/case";
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

/*
TODO
Ideas:
- item proxy
- items composition class
- reactive
*/

/* Non-visual web component for managing dynamically applied sheets. */
const css_items = (parent) => {
  const cls = class CssItems extends parent {
    #items = {};
    #pending_items = {};

    constructor() {
      super();
    }

    get items() {
      return { ...this.#items };
    }

    get target() {
      return this.#target;
    }
    #target;

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

      /*  */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.#target = this.parentElement;
          if (!this.#target.rule) {
            throw new Error(`Target does not have a rule.`);
          }

          /*  */
          this.update(this.#pending_items);
          this.#pending_items = {};
        } else {
          for (const [key, value] of Object.entries(this.#items)) {
            this.#target.rule.style.removeProperty(key);
          }
          this.#pending_items = { ...this.#items };
          this.#items = {};

          this.#target = null;
        }
      }, "connected");
    }

    update(updates = {}) {
      super.update && super.update(updates);

      for (let [key, value] of Object.entries(updates)) {
        if (value === undefined) {
          continue;
        }
        /* Normalize key */
        key = camel_to_kebab(key.trim());
        if (!this.#is_css(key)) {
          continue;
        }
        if (this.isConnected) {
          /* Handle null value -> removal */
          if (key in this.#items && value === null) {
            this.#target.rule.style.removeProperty(key);
            delete this.#items[key];
            this.attribute[key] = value;
            continue;
          }
          /* Normalize string value */
          value = value.trim();
          /* Ignore, if no change */
          if (this.#items[key] === value) {
            continue;
          }
          /* Update style */
          if (value.endsWith("!important")) {
            this.#target.rule.style.setProperty(
              key,
              value.slice(0, -"!important".length),
              "important"
            );
          } else {
            this.#target.rule.style.setProperty(key, value);
          }
          this.#items[key] = value;
          this.attribute[key] = value;
        } else {
          this.#pending_items[key] = value;
        }
      }
      return this;
    }

    #is_css = (key) => {
      return key.startsWith("--") || key in this.style;
    };
  };

  return cls;
};

Component.author(
  "css-items",
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
  css_items
);
