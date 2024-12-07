import { Component } from "rollo/component";
import {
  attribute,
  connected,
  name,
  properties,
  reactive,
  rules,
  sheet,
  state_to_attribute,
  uid,
} from "rollo/factories/__factories__";

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
  //properties,
  reactive,
  rules,
  sheet,
  state_to_attribute,
  uid,
  static_sheet
);
