import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  item_to_attribute,
  item_to_native,
  items,
  name,
  parent,
  properties,
  tags,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for reactive data. */
const data_reactive = (parent) => {
  const cls = class DataReactive extends parent {
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
  "data-reactive",
  HTMLElement,
  {},
  attribute,
  connected,
  hooks,
  item_to_attribute,
  item_to_native,
  items,
  name,
  parent,
  properties,
  tags,
  uid,
  data_reactive
);
