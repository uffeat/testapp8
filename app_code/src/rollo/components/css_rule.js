import { camel_to_kebab } from "rollo/utils/case";
import { Component, create } from "rollo/component";
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

      /* */
      const selector_effect = (data) => {
        if (this.rule) {
          /* Update rule */
        this.rule.selectorText = this.selector;
        }
        /* Sync to attribute */
        this.attribute.selector = this.selector;
      };

      /* */
      const items_effect = (data) => {
        const style = this.rule.style;
        for (const [key, { current }] of Object.entries(data)) {
          if (current === false) {
            style.removeProperty(key);
          } else {
            if (current.endsWith("!important")) {
              style.setProperty(
                key,
                value.slice(0, -"!important".length),
                "important"
              );
            } else {
              style.setProperty(key, current);
            }
          }
          this.attribute[key] = current;
        }
      };

      /* Add effect to handle target */
      this.effects.add((data) => {
        const current = data.target.current;
        const previous = data.target.previous;
        if (previous) {
          previous.rules && previous.rules.remove(this.rule);
          this.#rule = null;
          /* remove effect to control selector */
          this.effects.add(selector_effect);

          /* Remove effect to control declarations */
          this.#items.effects.remove(items_effect);
        }
        if (current) {
          if (!current.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create and add rule without items */
          this.#rule = current.rules.add(`${this.selector}`);
          /* Add effect to control selector */
          this.effects.add(selector_effect, "selector");
          /* Add effect to control declarations */
          this.#items.effects.add(items_effect);
        }
      }, "target");
      /* Add effect to set target from live DOM */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.target = this.parentElement;
        } else {
          this.target = null;
        }
      }, "connected");
    }

    get items() {
      return this.#items.data.current;
    }
    #items = new (class Items extends reactive(class {}) {
      constructor(owner) {
        super();
        this.#owner = owner;
      }

      get owner() {
        return this.#owner;
      }
      #owner;

      update(updates = {}) {
        super.update(
          Object.fromEntries(
            Object.entries(updates)
              .filter(
                ([key, value]) => this.owner.#is_css(key) && value !== undefined
              )
              .map(([key, value]) => [
                camel_to_kebab(key.trim()),
                typeof value === "string" ? value.trim() : value,
              ])
          )
        );
        return this.owner;
      }
    })(this);

    /* Returns rule. */
    get rule() {
      return this.#rule;
    }
    #rule;

    /* Returns selector. */
    get selector() {
      return this.$.selector;
    }
    /* Sets selector. */
    set selector(selector) {
      selector = selector || "*";
      this.$.selector = selector;
    }

    /* Provides getter/setter interface to items. */
    get style() {
      return this.#style;
    }
    #style = new Proxy(this, {
      get(target, key) {
        return target.items[key];
      },
      set(target, key, value) {
        target.update({ [key]: value });
        return true;
      },
    });

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

    /* Returns component with copy of items. */
    clone() {
      return create(this.tagName.toLowerCase(), this.items);
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

      /* 
      TODO
      object value -> sets selector AND items
      */




      /* Update items */
      this.#items.update(updates);

      return this;
    }

    #is_css = (key) => {
      return key.startsWith("--") || key in super.style;
    };
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
