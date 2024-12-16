import { Component } from "rollo/component";
import { attribute, hooks, name, observer, uid } from "rollo/factories/__factories__";

/* Non-visual web component for with no other function than to create a 
centralized wrapper for 'css-sheet' components */
const css_sheets = (parent, config, ...factories) => {
  const cls = class CssSheets extends parent {
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

    child_added_callback(node) {
      if (
        !(node instanceof HTMLElement) ||
        node.tag !== "css-sheet"
      ) {
        throw new Error(
          `'css-sheets' components only accepts 'css-sheet' child nodes.`
        );
      }
    }
  };

  return cls;
};

Component.author(
  "css-sheets",
  HTMLElement,
  {},
  attribute,
  hooks,
  name,
  observer,
  uid,
  css_sheets
);
