import { Component } from "rollo/component";
import { camel_to_kebab } from "rollo/utils/case";
import {
  attribute,
  connected,
  hooks,
  parent,
  properties,
  reactive,
  rule,
  state_to_attribute,
} from "rollo/factories/__factories__";

const data_keyframes_rule = (parent, config, ...factories) => {
  const cls = class DataKeyframesRule extends parent {
    constructor() {
      super();
    }

    get name() {
      return this.attribute.name || undefined
    }

    set name(name) {
      this.selector = `@keyframes ${name}`
      this.attribute.name = name;
    }

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates = {}) {
      super.update(
        Object.fromEntries(
          Object.entries(updates).filter(([key, value]) => key in this)
        )
      );
      //super.update && super.update(updates);

      for (const [selector, items] of Object.entries(updates)) {
        if (selector in this) {
          continue;
        }
        if (items === undefined) {
          continue;
        }
        if (selector.startsWith("@keyframes")) {
          /* Allow keyframes selector and items to be set in one go */
          this.update({ selector, ...items });
          continue;
        }


        if (!this.rule) {
          throw new Error(`'rule' not set.`);
        }





        //
        //this.rule.style.removeProperty(selector);
        //
        const text = `${selector} { ${Object.entries(items)
          .map(([selector, value]) => `${camel_to_kebab(selector)}: ${value};`)
          .join(" ")} }`;
        this.rule.appendRule(text);
      }
    }
  };
  return cls;
};

Component.author(
  "data-keyframes-rule",
  HTMLElement,
  {},
  attribute,
  connected,
  hooks,
  parent,
  properties,
  reactive,
  rule,
  state_to_attribute,
  data_keyframes_rule
);
