import "./bootstrap.scss";
import "./main.css";
import { Component, create } from "rollo/component";

import { Reactive } from "./rollo/reactive";

// TODO
// ... then nav bar
// ... then Accordion
// ... then form
// ... then dropdown and popover
// ... then ProgressiveImage

// ... then loader
// ... then carousel
// ... then placeholder
// ... then tooltip
// ... then scrollspy

const root = create("DIV", { id: "root", parent: document.body });

//
//

/*
TODO
- items values as css vars - in combination with prefixing selector (class or attr);
  should be driven from element, i.e., add rule on-demand.
- scoping if placed in element with scope selector prop or if not placed in head

- a sheet can be disabled (native prop)
*/


// Import instead
function camel_to_kebab(camel) {
  return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

class Rule extends HTMLElement {
  static create = (...args) => {
    return new Rule(...args);
  };
  #items = {};
  #name;
  #sheet;
  #remove;
  #rule;
  #selector;
  #style_element = document.createElement("style");

  constructor(selector, { name } = {}) {
    super();
    this.style.display = "none";
    /* Create helper display (for dev) */
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.append(this.#style_element);
    this.shadowRoot.append(template);

    this.#selector = selector;
    if (name) {
      this.name = name;
    }
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.sheet = this.parentElement;
  }

  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();
    this.sheet = null;
  }

  get name() {
    return this.#name;
  }

  /* For dom identification */
  set name(name) {
    this.#name = name;
    if (name) {
      this.setAttribute("name", name);
    } else {
      this.removeAttribute("name");
    }
  }

  /* Returns any parent sheet component*/
  get sheet() {
    return this.#sheet;
  }

  /* */
  set sheet(sheet) {
    if (sheet) {
      if (sheet !== this.#sheet) {
        if (sheet.tagName !== "SHEET-COMPONENT") {
          throw new Error(
            `Rule components should be children of a sheet component.`
          );
        }

        const { remove, rule } = sheet.create_rule(this.#selector);
        this.#remove = remove;
        this.#rule = rule;

        //
        const parent_sheet = this.#rule.parentStyleSheet;
        console.log(parent_sheet); ////
        //
      }
    } else {
      this.#items = {};
      this.#remove = null;
      this.#rule = null;
    }

    this.#sheet = sheet;
  }

  get rule() {
    return this.#rule;
  }

  get selector() {
    if (!this.#selector) {
      throw new Error(`'selector' not set.`);
    }
    return this.#selector;
  }

  /* Returns a text representation of the rule. */
  get text() {
    if (this.#rule) {
      return this.#rule.cssText;
    }
  }

  /* Updates rule declarations. Chainable. */
  update = (items) => {
    if (!this.#rule) {
      throw new Error(`'rule' not set.`);
    }

    /* Infer changed items */
    const changes = Object.fromEntries(
      Object.entries(items).filter(([key, value]) => this.#items[key] !== value)
    );
    /* Update items */
    Object.entries(changes)
      .filter(([key, value]) => ![false, null, undefined].includes(value))
      .forEach(([key, value]) => (this.#items[key] = value));

    const var_declarations = Object.entries(changes).filter(([key]) =>
      key.startsWith("--")
    );

    const standard_declarations = Object.entries(changes).filter(
      ([key, value]) => !key.startsWith("--")
    );

    standard_declarations.forEach(([key, ..._]) => this.#validate(key));

    const declarations = [...var_declarations, ...standard_declarations];

    declarations
      .map(([key, value]) => {
        if (value && value.endsWith("!important")) {
          return [key, value.slice(0, -"!important".length).trim(), true];
        }
        return [key, value];
      })
      .map(([key, ..._]) => [camel_to_kebab(key), ..._])
      .forEach(([key, value, important]) => {
        if ([false, null, undefined].includes(value)) {
          this.#rule.style.removeProperty(key);
        } else {
          this.#rule.style.setProperty(
            key,
            value,
            important ? "important" : ""
          );
        }
      });

    this.#update_display();
    return this;
  };

  /* Shows content of sheet. Serves no other purpose */
  #update_display = async () => {
    this.#style_element.textContent = this.text;
  };

  /* Checks declaration key. */
  #validate = (key) => {
    if (!key.startsWith("--")) {
      if (!(key in this.style)) {
        throw new Error(`Invalid key: ${key}`);
      }
    }
  };
}

customElements.define("rule-component", Rule);

/* Non-visual web component for managing dynamic sheets.
  Notable features:
  - The sheet applies itself to its root node (document or a shadow root)
    dynamically as per the component's lifecycle (connect/disconnect).
  - Rules can be appended with standard object notation.
  - Integrated with rule components.
  - For dev purposes, the current content (css) of the staic sheet is shown in
    the component's shadow dom.
  */
class Sheet extends HTMLElement {
  static create = (...args) => {
    return new Sheet(...args);
  };

  /* Removes first occurrence of item from array (strict equality). */
  static #remove_item = (arr, item) => {
    const index_to_remove = arr.indexOf(item);
    if (index_to_remove !== -1) {
      arr.splice(index_to_remove, 1);
    }
    return arr;
  };

  #name;

  #sheet = new CSSStyleSheet();
  #style_element = document.createElement("style");
  #target;

  constructor({ name } = {}, ...args) {
    super();
    this.style.display = "none";
    /* Create helper display (for dev) */
    this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.append(this.#style_element);
    this.shadowRoot.append(template);

    let text = "";
    for (const arg of args) {
      /* Ignore undefined to support iife's */
      if (!arg) {
        continue;
      } else if (typeof arg === "function") {
        /* arg is a hook. Useful, when dealing with conditional rules. */
        arg.call(this);
      } else {
        /* arg can be assumed to be a single-item object */
        const first_key = Object.keys(arg)[0];
        const first_value = Object.values(arg)[0];

        /*
                  TODO
                  - Dry
                  - animation declarations
                  */

        if (first_key.startsWith("@")) {
          const media = first_key;
          const block = first_value;

          const sheet = new CSSStyleSheet();
          sheet.insertRule(`${media} {}`);
          const media_rule = sheet.cssRules[0];

          for (const [selector, items] of Object.entries(block)) {
            if (items === undefined) {
              continue;
            }
            media_rule.insertRule(`${selector} {}`);
            const rule = media_rule.cssRules[0];
            for (const [key, value] of Object.entries(items)) {
              if (value === undefined) {
                continue;
              }
              this.#validate(key);
              if (value.endsWith("!important")) {
                rule.style.setProperty(
                  key,
                  value.slice(0, -"!important".length).trim(),
                  "important"
                );
              } else {
                rule.style.setProperty(camel_to_kebab(key), value);
              }
            }
          }
          text += media_rule.cssText;
        } else {
          const selector = first_key;
          const items = first_value;
          const sheet = new CSSStyleSheet();
          sheet.insertRule(`${selector} {}`);
          const rule = sheet.cssRules[0];
          for (const [key, value] of Object.entries(items)) {
            if (value === undefined) {
              continue;
            }
            this.#validate(key);
            if (value.endsWith("!important")) {
              rule.style.setProperty(
                key,
                value.slice(0, -"!important".length).trim(),
                "important"
              );
            } else {
              rule.style.setProperty(camel_to_kebab(key), value);
            }
          }
          text += rule.cssText;
        }
      }
    }
    this.text = text;

    this.#update_display();
  }

  /* API for rule components */
  create_rule = (selector) => {
    const index = this.#sheet.insertRule(`${selector} {}`, this.size);
    const rule = this.#sheet.cssRules[index];

    const remove = () => {
      this.#sheet.deleteRule(index);
    };

    return { remove, rule };
  };

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.target = this.getRootNode();
  }

  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();
    this.target = null;
  }

  get name() {
    return this.#name;
  }

  /* For dom identification */
  set name(name) {
    this.#name = name;
    if (name) {
      this.setAttribute("name", name);
    } else {
      this.removeAttribute("name");
    }
  }

  /* Returns the number of rules. */
  get size() {
    return this.#sheet.cssRules.length;
  }

  /* Return the target for the sheet. */
  get target() {
    return this.#target;
  }

  /* Sets the current target for the sheet. Falsy values unadopts. */
  set target(target) {
    if (this.#target !== target) {
      if (this.#target) {
        Sheet.#remove_item(this.#target.adoptedStyleSheets, this.#sheet);
      }
      if (target) {
        target.adoptedStyleSheets.push(this.#sheet);
      }
      this.#target = target;
    }
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
    this.#update_display();
  }

  /* Shows content of sheet. Serves no other purpose */
  #update_display = async () => {
    this.#style_element.textContent = `/* This is the staic part of the sheet */\n${this.text}`;
  };

  /* Checks declaration key. */
  #validate = (key) => {
    if (!key.startsWith("--")) {
      if (!(key in this.style)) {
        throw new Error(`Invalid key: ${key}`);
      }
    }
  };
}

customElements.define("sheet-component", Sheet);

// Example

create("h1", { parent: root }, "Hello World");
create("h2", { parent: root }, "Also hello from here");

const my_rule = Rule.create("h1");

const sheet_1 = Sheet.create(
  {
    name: "sheet_1",
  },
  function () {
    console.log("My hook");
  },
  {
    "@media (width <= 600px)": {
      div: {
        "background-color": "pink",
      },
    },
  },
  {
    h1: {
      "--color": "green !important",
      color: "var(--color)",
      backgroundColor: "linen",
      padding: "8px",
      border: "4px solid blue",
    },
  },
  { "h1:hover": { border: "4px solid green" } },
  {
    h2: {
      color: "blue",
      "background-color": "pink",
      border: "2px solid white",
    },
  },
  { "h2:hover": { border: "2px solid green" } }
);

sheet_1.append(my_rule);

root.append(sheet_1);

my_rule.update({ backgroundColor: "yellow" });
my_rule.update({ backgroundColor: "beige" });

//
//

console.log(my_rule.text);
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
