import { Component } from "rollo/component";
import {
  attribute,
  connected,
  name,
  parent,
  properties,
  reactive,
  sheet,
  state_to_attribute,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for managing dynamically applied sheets. */
const factory = (parent) => {
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

    get disabled() {
      return this.#sheet.disabled;
    }

    set disabled(disabled) {
      this.#sheet.disabled = disabled;
      this.attribute.disabled = disabled;
    }

    get sheet() {
      return this.#sheet;
    }
    #sheet = new CSSStyleSheet();

    get size() {
      return this.#sheet.cssRules.length;
    }

    /* Returns a text representation of the sheet. */
    get text() {
      return [...this.#sheet.cssRules]
        .map((rule) => `${rule.cssText}`)
        .join("\n");
    }

    /* Sets rules from text. */
    set text(text) {
      this.#sheet.replaceSync(text);
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
  parent,
  name,
  properties,
  reactive,
  sheet,
  state_to_attribute,
  uid,
  factory
);
