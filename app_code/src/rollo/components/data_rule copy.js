import { Component } from "rollo/component";
import { rule } from "rollo/factories/__factories__";

/* Non-visual web component for dynamic rules. */
const data_rule = (parent) => {
  const cls = class DataRule extends parent {
    constructor({ sheet, selector, updates }) {
      super({ sheet, selector, updates });
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
  };

  return cls;
};

Component.author("data-rule", HTMLElement, {}, rule, data_rule);
