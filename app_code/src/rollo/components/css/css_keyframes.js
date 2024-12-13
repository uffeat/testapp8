import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  item_to_attribute,
  item_to_native,
  items,
  name,
  properties,
  uid,
} from "rollo/factories/__factories__";
import { rule } from "rollo/components/css/factories/rule";
import { rules } from "rollo/components/css/factories/rules";
import { target } from "rollo/components/css/factories/target";
import { text } from "rollo/components/css/factories/text";

/* Non-visual web component for controlling CSS media rules of parent component's sheet.


*/
const css_keyframes = (parent) => {
  const cls = class CssKeyframes extends parent {
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
  "css-keyframes",
  HTMLElement,
  {},
  attribute,
  connected,
  hooks,
  item_to_attribute,
  item_to_native,
  items,
  name,
  properties,
  rule,
  rules,
  target,
  text,
  uid,
  css_keyframes
);
