import { Component, create } from "rollo/component";
import {
  attribute,
  connected,
  name,
  properties,
  reactive,
  sheet,
  state_to_attribute,
  uid,
} from "rollo/factories/__factories__";
import "rollo/components/data_rule";

/* Non-visual web component for managing dynamically applied sheets. */
const static_sheet = (parent) => {
  const cls = class DataStaticSheet extends parent {
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
      this.style.display = "none";
    }

    update(updates = {}) {
      super.update && super.update(updates); ////

      const css = Object.fromEntries(
        Object.entries(updates).filter(([key, value]) => !(key in this))
      );

      for (const [selector, items] of Object.entries(css)) {
        if (selector.startsWith("@media")) {
          create("data-media-rule", {
            sheet: this.sheet,
            selector,
            ...items,
          });
          continue;
        }
        if (selector.startsWith("@keyframes")) {
          create("data-keyframes-rule", {
            sheet: this.sheet,
            selector,
            ...items,
          });
          continue;
        }
        create("data-rule", {
          selector,
          sheet: this.sheet,
          ...items,
        });
      }

      return this;
    }
  };

  return cls;
};

Component.author(
  "data-static-sheet",
  HTMLElement,
  {},
  attribute,
  connected,
  name,
  properties,
  reactive,
  sheet,
  state_to_attribute,
  uid,
  static_sheet
);
