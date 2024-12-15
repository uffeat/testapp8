import { Component, create } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  items,
  name,
  properties,
  uid,
} from "rollo/factories/__factories__";
import { RulesController } from "rollo/components/css/utils/rules";
import { sheet } from "rollo/components/css/factories/sheet";

/* Non-visual web component for creating a style element and setting its text from JS. */
const css_style = (parent, config, ...factories) => {
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
      ////this.style.display = "none";////
    }

    
  };

  return cls;
};

Component.author(
  "css-style",
  HTMLElement,
  {},
  attribute,
  connected,
  hooks,
  items,
  name,
  properties,
  uid,
  css_style
);
