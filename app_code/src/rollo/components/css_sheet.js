
import { Component } from "rollo/component";
import {
  attribute,
  connected,
  descendants,
  hooks,
  name,
  properties,
  reactive,
  sheet,
  state_to_attribute,
  uid,
} from "rollo/factories/__factories__";


/* Non-visual web component for managing dynamically applied sheets. */
const css_sheet = (parent) => {
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

    /* Returns a text representation of the sheet.
    Primarily as a dev tool to check the sheet content. */
    get text() {
      return [...this.sheet.cssRules]
        .map((rule) => `${rule.cssText}`)
        .join("\n");
    }

    /* Sets rules from text. */
    set text(text) {
      this.descendants.clear()
      this.sheet.replaceSync(text);
    }

    
  };

  return cls;
};

Component.author(
  "css-sheet",
  HTMLElement,
  {},
  attribute,
  connected,
  descendants,
  hooks,
  name,
  properties,
  reactive,
  sheet,
  state_to_attribute,
  uid,
  css_sheet
);
