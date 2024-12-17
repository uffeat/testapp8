import { Component } from "rollo/component";
import {
  attribute,
  chain,
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
const data_state = (parent) => {
  const cls = class DataState extends parent {
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

    /* Handles hooks. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - after 'update' 
    - before 'created_callback'
    - before live DOM connection */
    call(...hooks) {
      super.call && super.call(...hooks);
      /* Handle effects */
      hooks
        .filter((hook) => Array.isArray(hook))
        .forEach(([effect, condition]) => {
          this.effects.add(effect, condition)
        });
      
      return this
    }
  };

  return cls;
};

Component.author(
  "data-state",
  HTMLElement,
  {},
  attribute,
  chain,
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
  data_state
);
