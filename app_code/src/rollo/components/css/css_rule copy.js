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
import { items_to_rules } from "rollo/components/css/factories/items_to_rules";
import { rule } from "rollo/components/css/factories/rule";
import { target } from "rollo/components/css/factories/target";
import { text } from "rollo/components/css/factories/text";

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
  - 'rule' setter (resets):
      my_rule.rule = { h2: { color: "orange" } };
- Selector can also be set directly via the 'selector' getter.
- Items can also be changed via
  - '$' setter:
    my_rule.$.color = "blue";
  - 'rule' setter (resets items):
      my_rule.rule = {color: 'orange'};
- `false` item values removes declaration.
- 'clone' method for creating a component with a copy of items.
- Support hooks and iife's.
Advantages of in-DOM use:
- Provides 'visual' composition of sheets 
  (can itself be used in other stylesheets!).
- Rule can be retrived by DOM methods and used by other components.
*/
const css_rule = (parent, config, ...factories) => {
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
    created_callback() {
      super.created_callback && super.created_callback();
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
      /* Add effect to control selector effect */
      this.effects.add((changes, previous) => {
        if (this.rule) {
          this.effects.add(selector_effect, "selector");
        } else {
          this.effects.remove(selector_effect);
        }
      }, "rule");
    }

    /* Returns CSS rule state. */
    get rule() {
      return this.$.rule;
    }
    /* Resets items and optionally selector from object. */
    set rule(rule) {
      /* Reset all items */
      this.items.update(
        Object.fromEntries(
          Object.entries(this.items.current)
            .filter(([key, value]) => this.is_css(key))
            .map(([key, value]) => [key, false])
        )
      );
      /* Update items and optionally selector */
      this.update(rule);
    }

    /* Returns selector state. */
    get selector() {
      return this.$.selector || "*";
    }
    /* Sets selector state. */
    set selector(selector) {
      selector = selector || "*";
      this.$.selector = selector;
    }

    /* Returns text representation of rule. */
    get text() {
      if (this.rule) {
        return this.rule.cssText;
      }
      /* NOTE For dev -> performance not critical. */
      if (this.selector && Object.keys(this.items.current).length) {
        return `${this.selector} { ${Object.entries(this.items.current)
          .filter(([key, value]) => this.is_css(key))
          .map(([key, value]) => `${key}: ${value};`)
          .join(" ")} }`;
      }
    }

    /* Returns component with copy of selector and items. */
    clone() {
      return create(this.tagName.toLowerCase(), {
        selector: this.selector,
        ...this.items.filter((k) => this.is_css(k)),
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

      return this;
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
  items,
  items_to_rules,
  name,
  properties,
  rule,
  target,
  text,
  uid,
  css_rule
);
