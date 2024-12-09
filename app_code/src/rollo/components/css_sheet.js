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
  state_to_native,
  tags,
  uid,
} from "rollo/factories/__factories__";
import { Rules } from "rollo/components/utils/rules";

/* Non-visual web component for managing dynamically applied sheets. 


TODO
Mention state_to_native re disabled


*/
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
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      this.style.display = "none";
    }

    get rules() {
      return this.#rules;
    }
    #rules = Rules.create(this.sheet);

    /* Returns a text representation of the sheet.
    Primarily as a dev tool to check the sheet content. */
    get text() {
      return this.rules.text
    }
    /* Sets rules from text. */
    set text(text) {
      this.descendants.clear();
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
  state_to_native,
  tags,
  uid,
  css_sheet
);
