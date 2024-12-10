import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  name,
  parent,
  properties,
  reactive,
  state_to_attribute,
  state_to_native,
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
    created_callback(config) {
      super.created_callback && super.created_callback(config);
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
  name,
  parent,
  properties,
  reactive,
  state_to_attribute,
  state_to_native,
  uid,
  data_reactive
);
