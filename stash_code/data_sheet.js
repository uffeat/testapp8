/*
TODO
- Option to set target (useful when not used as web component)
- Option for autoscoping to sheet name - and autoassignment of class/attr to  non-rule child  components

*/



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
import "rollo/components/data_media_rule";
import "rollo/components/data_keyframes_rule";

/* Non-visual web component for managing dynamically applied sheets. */
const data_sheet = (parent) => {
  const cls = class DataSheet extends parent {
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
  "data-sheet",
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
  data_sheet
);
