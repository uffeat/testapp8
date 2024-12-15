import { Component } from "rollo/component";
import {
  attribute,
  connected,
  descendants,
  hooks,
  items,
  name,
  observer,
  properties,
  uid,
} from "rollo/factories/__factories__";
import { RulesController } from "rollo/components/css/utils/rules";
import { sheet } from "rollo/components/css/factories/sheet";

/* Non-visual web component for managing dynamically applied dynamic sheets. */
const css_sheet = (parent, config, ...factories) => {
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

    child_added_callback(node) {
      /* Warn */
      if (import.meta.env.DEV) {
        if (this.querySelector("css-static") && this.children.length > 1) {
          console.warn(
            `'css-sheet' components with a 'css-static' child should generally not have any other children.`
          );
        }
      }
    }

    child_removed_callback(node) {
      /* Warn */
      if (import.meta.env.DEV) {
        if (
          node instanceof HTMLElement &&
          node.tag === "css-static"
        ) {
          console.warn(
            `'css-static' components inside 'css-sheet' components should generally not be removed. Consider disabling (or removing) the 'css-sheet' component instead.`
          );
        }
      }
    }

    get rules() {
      return this.#rules;
    }
    #rules = new RulesController(this.sheet);

    /* Returns a text representation of the sheet. */
    get text() {
      /* NOTE For dev -> performance not critical. */
      return [...this.sheet.cssRules]
        .map((rule) => `${rule.cssText}`)
        .join("\n");
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
  items,
  name,
  observer,
  properties,
  sheet,
  uid,
  css_sheet
);
