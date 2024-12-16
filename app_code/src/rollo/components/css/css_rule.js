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
import { is_css } from "rollo/components/css/factories/is_css";
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
      /* Effect complex to let rule add/remove effect to control selector. */
      new (class {
        constructor(owner) {
          this.#owner = owner;
          owner.effects.add(() => {
            if (owner.rule) {
              owner.effects.add(this.effect, "selector");
            } else {
              owner.effects.remove(this.effect);
            }
          }, "rule");
        }
        get owner() {
          return this.#owner;
        }
        #owner;
        effect = () => {
          /* Update rule */
          this.owner.rule.selectorText = this.owner.selector;
          /* Sync to attribute */
          this.owner.attribute.selector = this.owner.selector;
        };
      })(this);
    }

    /* Returns CSS rule state. */
    get rule() {
      return this.$.rule;
    }
    /* Resets items and optionally selector from object. */
    set rule(rule) {
      /* Reset all items */
      this.items.update(
        this.items.current
          .clone()
          .filter(([k, v]) => this.is_css(k))
          .reset(false)
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
      if (this.selector && this.items.current.size) {
        return `${this.selector} { ${this.items.current.entries
          .filter(([k, v]) => this.is_css(k))
          .map(([k, v]) => `${k}: ${v};`)
          .join(" ")} }`;
      }
    }

    /* Returns component with copy of selector and items. */
    clone() {
      return create(this.tag, {
        selector: this.selector,
        ...this.items.current.filter(([k, v]) => this.is_css(k)),
      });
    }

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates) {
      super.update && super.update(updates);
      /* Allow setting selector and items in one go */
      Object.entries(updates)
        .filter(([k, v]) => !(k in this) && typeof v === "object")
        .map(([k, v]) => ({ selector: k, items: v }))
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
  is_css,
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
