import { Component, create } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  name,
  properties,
  reactive,
  rule,
  state_to_attribute,
} from "rollo/factories/__factories__";
import "rollo/components/data_rule";

const data_media_rule = (parent, config, ...factories) => {
  const cls = class DataMediaRule extends parent {
    constructor() {
      super();
    }

    /* Create alias for 'selector' */
    get media() {
      return this.selector;
    }

    set media(media) {
      this.selector = media
    }

    get size() {
      if (this.rule) {
        return this.rule.cssRules.length
      }
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
        if (selector.startsWith("@media")) {
          /* Allow media selector and items to be set in one go */
          this.update({ selector, ...items });
          continue;
        }
        create("data-rule", {
          selector,
          sheet: this.rule,
          ...items,
        });
      }
      return this;
    }
  };
  return cls;
};

Component.author(
  "data-media-rule",
  HTMLElement,
  {},
  attribute,
  connected,
  hooks,
  name,
  properties,
  reactive,
  rule,
  state_to_attribute,
  data_media_rule
);
