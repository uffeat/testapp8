import { Component, create } from "rollo/component";
import {
  attribute,
  connected,
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
  name,
  properties,
  reactive,
  rule,
  state_to_attribute,
  data_media_rule
);
