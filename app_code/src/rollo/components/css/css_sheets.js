import { Component } from "rollo/component";
import { attribute, name, uid } from "rollo/factories/__factories__";

/* Non-visual web component for ... */
const css_sheets = (parent, config, ...factories) => {
  const cls = class CssSheet extends parent {
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
  };

  return cls;
};

Component.author(
  "css-sheets",
  HTMLElement,
  {},
  attribute,
  name,
  uid,
  css_sheets
);
