import { camel_to_kebab } from "rollo/utils/case";
import { Component, create } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  name,
  properties,
  reactive,
  state_to_attribute,
  state_to_native,
  uid,
} from "rollo/factories/__factories__";

/*
TODO
Ideas:
- item proxy
- items composition class
- reactive
*/

/* Non-visual web component for controlling CSS declarations of parent component's rule.
Notable features:
- Adds/removes items (CSS declarations) as the component is connected/disconnected.
- Shows items as attributes (can itself be used in other stylesheets!).
- Supports kebab- as well as camel-case.
- Supports CSS var declarations and standard declarations, incl. with `!important`.
- Items can be updated with the standard update method, e.g., 
    my_items.update({backgroundColor: 'yellow'})
- Guards agains redundant updates.
- Items can be made reactive with the '$'-syntax, e.g.,
    my_items.$.$color = 'red'
  not only set the color, but also enables effects to be set up, like:
    my_items.effects.add((data) => {
      console.log('The color is:', my_items.$.$color)
    }, '$color')
- `false` item value removes declaration.
- 'clone' method for creating a component with a copy of items.
- Support hooks and iife's.
*/
const css_items = (parent) => {
  const cls = class CssItems extends parent {
    constructor() {
      super();
    }

    get items() {
      return { ...this.#items };
    }
    #items = {};
    #pending_items = {};

    /* Provides getter/setter interface to items. */
    get style() {
      return this.#style;
    }
    #style = new Proxy(this, {
      get(target, key) {
        return target.#items[key];
      },
      set(target, key, value) {
        target.update({ [key]: value });
        return true;
      },
    });

    get target() {
      return this.#target;
    }
    #target;

    /* Returns component with copy of items. */
    clone() {
      return create(this.tagName.toLowerCase(), this.items);
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
      /* Add connect-effect to control rule in parent  */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.#target = this.parentElement;
          /* Check parent */
          if (!this.#target.rule) {
            throw new Error(`Target does not have a rule.`);
          }
          /* Add items to rule */
          this.update(this.#pending_items);
          /* Reset */
          this.#pending_items = {};
        } else {
          /* Remove items from rule */
          for (const key of Object.keys(this.#items)) {
            /* NOTE If target has been disconnected, it has no rule; therefore check */
            if (this.#target.rule) {
              this.#target.rule.style.removeProperty(key);
            }
          }
          /* Reset and make ready for next connection */
          this.#pending_items = { ...this.#items };
          this.#items = {};
          this.#target = null;
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

      for (let [key, value] of Object.entries(updates)) {
        /* Ignore undefined values to support iifee's */
        if (value === undefined) {
          continue;
        }
        /* Normalize key */
        key = camel_to_kebab(key.trim());
        if (!this.#is_css(key)) {
          continue;
        }
        if (this.#target) {
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
      return key.startsWith("--") || key in super.style;
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
  state_to_native,
  uid,
  css_items
);
