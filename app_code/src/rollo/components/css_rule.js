import { camel_to_kebab } from "rollo/utils/case";
import { Component, create } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  items,
  name,
  properties,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for controlling CSS rule.
Can be used in- or off-DOM.
Notable features:
- Injects itself into target (sheet or media rule) by
  - explicitly setting 'target', or
  - implicitly setting 'target' from DOM parent 
    (dynamically managed according to component lifecycle)
- Shows selector and items as attributes.
- Selector and items are reactive.
- Supports kebab- as well as camel-case.
- Supports CSS var declarations and standard declarations, incl. with `!important`.
- Selector and/or items can be changed via
  - standard 'update' method:
      update({
        h1: {
          color: "pink",
          backgroundColor: "linen",
        }
      })
    OR:
      update({
        selector: 'h1',
        color: "pink",
        backgroundColor: "linen",
      })
- Selector can also be set directly via the 'selector' getter.
- Items can also be changed via
  - state, e.g., `my_rule.$.color = "blue";`
  - the 'style' setter (individual items)
- `false` item values removes declaration.
- 'clone' method for creating a component with a copy of items.
- Support hooks and iife's.
Advantages of in-DOM use:
- Provides 'visual' composition of sheets 
  (can itself be used in other stylesheets!).
- Rule can be retrived by DOM methods and used by other components.
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

      /* Effect to control selector. */
      const selector_effect = (changes) => {
        if (this.rule) {
          /* Update rule */
          this.rule.selectorText = this.selector;
        }
        /* Sync to attribute */
        this.attribute.selector = this.selector;
      };
      /* Effect complex to control items. */
      const items = new (class {
        #owner;
        constructor(owner) {
          this.#owner = owner;
        }
        condition = (changes) => {
          return Object.fromEntries(
            Object.entries(changes)
              .filter(
                ([key, value]) =>
                  this.#owner.#is_css(key) && value !== undefined
              )
              .map(([key, value]) => [
                camel_to_kebab(key.trim()),
                typeof value === "string" ? value.trim() : value,
              ])
          );
        };
        effect = (changes) => {
          const style = this.#owner.rule.style;
          for (const [key, value] of Object.entries(changes)) {
            if (value === false) {
              /* false is a cue to remove */
              style.removeProperty(key);
            } else {
              /* Update rule */
              if (value.endsWith("!important")) {
                style.setProperty(
                  key,
                  value.slice(0, -"!important".length),
                  "important"
                );
              } else {
                style.setProperty(key, value);
              }
            }
            /* Sync to attribute */
            this.#owner.attribute[key] = value;
          }
        };
      })(this);

      /* Add effect to handle target */
      this.effects.add((changes, previous) => {

        console.log('changes:', changes)
        console.log('previous:', previous)



        const current = changes.target;
        previous = previous.target;

        


        console.log('previous target:', previous)



        /* Disengage from any previous target */
        if (previous) {
          /* Remove rule from previous target */
          previous.rules && previous.rules.remove(this.rule);
          /* Reset rule */
          this.#rule = null;
          /* Remove effect to control selector */
          this.effects.remove(selector_effect);
          /* Remove effect to control items */
          this.effects.remove(items.effect);
        }
        /* Engage with any current target */
        if (current) {
          if (!current.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create and add rule without items */
          this.#rule = current.rules.add(`${this.selector}`);
          /* Add effect to control selector */
          this.effects.add(selector_effect, "selector");
          /* Add effect to control items */
          this.effects.add(items.effect, items.condition);
        }
      }, "target");
      /* Add effect to set target from live DOM */
      this.effects.add((changes) => {
        if (this.connected) {
          this.target = this.parentElement;
        } else {


          console.log('HERE')////




          this.target = null;
        }
      }, "connected");
    }

    /* Returns CSS rule. */
    get rule() {
      return this.#rule;
    }
    /* Resets items and optionally selector from object. */
    set rule(rule) {
      /* Reset all items */
      this.items.update(Object.fromEntries(
        Object.entries(this.items.current).filter(([key, value]) => this.#is_css(key) ).map(([key, value]) => [
          key,
          false,
        ])
      ))
      /* Update items and optionally selector */
      this.update(rule)
    }
    #rule;

    /* Returns selector state. */
    get selector() {
      return this.$.selector || "*";
    }
    /* Sets selector state. */
    set selector(selector) {
      selector = selector || "*";
      this.$.selector = selector;
    }

    /* Provides getter/setter interface to single items. */
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

    /* Returns target state. */
    get target() {
      return this.$.target;
    }
    /* Sets target state. */
    set target(target) {
      this.$.target = target;
    }

    /* Returns text representation of rule.
    NOTE Primarily for dev. */
    get text() {
      if (this.rule) {
        return this.rule.cssText;
      }
    }

    /* Returns component with copy of selector and items. */
    clone() {
      return create(this.tagName.toLowerCase(), {
        selector: this.selector,
        ...this.items.current,
      });
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
      /* Allow setting selector and items in one go */
      Object.entries(updates)
        .filter(([key, value]) => !(key in this) && typeof value === "object")
        .map(([key, value]) => ({ selector: key, items: value }))
        .forEach(({ selector, items }) => {
          this.selector = selector;
          this.items.update(items);
        });

      /* Allow updating items without the '$'-syntax */
      this.items.update(updates);

      return this;
    }

    /* Checks if key is a valid CSS key. */
    #is_css = (key) => {
      return (
        typeof key === "string" && (key.startsWith("--") || key in super.style)
      );
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
  hooks,
  items,
  name,
  properties,
  uid,
  css_rule
);
