import { Component } from "rollo/component";
import { camel_to_kebab } from "rollo/utils/case";
import {
  attribute,
  connected,
  name,
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
  name,
  properties,
  reactive,
  rule,
  state_to_attribute,
  data_keyframes_rule
);
