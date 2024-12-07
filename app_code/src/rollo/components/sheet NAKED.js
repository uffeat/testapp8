import { Component } from "rollo/component";
import {
  attribute,
  connected,
  parent,
  properties,
  reactive,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for managing dynamically applied sheets. */
const factory = (parent) => {
  const cls = class DataSheet extends parent {
    #name;
    #target;
    constructor() {
      super();
    }

    created_callback() {
      super.created_callback && super.created_callback();

      this.style.display = "none";

      /* adopt/unadopt as per connected/disconnected */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.#target = this.getRootNode();
          this.#target.adoptedStyleSheets.push(this.#sheet);
        } else {
          const index = this.#target.adoptedStyleSheets.indexOf(this.#sheet);
          if (index !== -1) {
            this.#target.adoptedStyleSheets.splice(index, 1);
          }
          this.#target = null;
        }
      }, "connected");

      /* Show state as attribute */
      this.effects.add((data) => {
        for (let [key, { current, previous }] of Object.entries(data)) {
          key = `state-${key}`;
          if (["boolean", "number", "string"].includes(typeof current)) {
            this.attribute[key] = current;
          } else {
            this.attribute[key] = null;
          }
        }
      });
    }

    get disabled() {
      return this.#sheet.disabled;
    }

    set disabled(disabled) {
      this.#sheet.disabled = disabled;
      this.attribute.disabled = disabled;
    }

    get name() {
      return this.#name;
    }

    /* For dom identification */
    set name(name) {
      this.#name = name;
      this.attribute.name = name;
    }

    get sheet() {
      return this.#sheet;
    }
    #sheet = new CSSStyleSheet();

    get size() {
      return this.#sheet.cssRules.length
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
  "data-sheet",
  HTMLElement,
  {},
  attribute,
  connected,
  parent,
  properties,
  reactive,
  uid,
  factory
);
