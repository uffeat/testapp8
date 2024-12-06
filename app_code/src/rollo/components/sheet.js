import { camel_to_kebab } from "rollo/utils/case";

/* Non-visual web component for managing dynamically applied sheets.
  Notable features:
  - The sheet applies itself to its root node (document or a shadow root)
    dynamically as per the component's lifecycle (connect/disconnect).
  - Supported rules:
    - Standard.
    - CSS var declarations.
    - '!important'.
    - Media.
    - Keyframe.
  - Rules can be appended with standard object notation and a syntax that 
    resembles native CSS with optional camel case keys.
*/
export class Sheet extends HTMLElement {
  static create = (...args) => {
    return new Sheet(...args)
  };
  #name;
  #sheet = new CSSStyleSheet();
  #target;

  constructor({ name } = {}, ...args) {
    super();
    this.style.display = "none";
    if (name) {
      this.#name = name;
      this.setAttribute("name", name);
    }
    this.rules.append(...args);
  }

  connectedCallback() {
    this.#target = this.getRootNode();
    this.#target.adoptedStyleSheets.push(this.#sheet);
  }

  disconnectedCallback() {
    const index = document.adoptedStyleSheets.indexOf(this.#sheet);
    if (index !== -1) {
      document.adoptedStyleSheets.splice(index, 1);
    }
    this.#target = null;
  }

  get disabled() {
    return this.#sheet.disabled;
  }

  set disabled(disabled) {
    this.#sheet.disabled = disabled;
  }

  get name() {
    return this.#name;
  }

  /* Returns rules controller. */
  get rules() {
    return this.#rules;
  }
  #rules = new (class {
    #owner;
    constructor(owner) {
      this.#owner = owner;
    }

    get rules() {
      return this.#owner.#sheet.cssRules;
    }

    /* Returns the number of rules. */
    get size() {
      return this.#owner.#sheet.cssRules.length;
    }

    append = (...args) => {
      return this.#owner.#append_rules(...args);
    };
  })(this);

  get sheet() {
    return this.#sheet;
  }

  /* Return the target for the sheet. */
  get target() {
    return this.#target;
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

  #append_rules = (...args) => {
    for (let arg of args) {
      /* Ignore undefined to support iife's */
      if (!arg) {
        continue;
      }
      if (typeof arg === "function") {
        /* arg is a hook. Useful, when dealing with conditional rules. */
        const result = arg.call(this);
        if (result) {
          arg = result;
        } else {
          continue;
        }
      }
      /* arg can be assumed to be a single-item object */
      const keys = Object.keys(arg);
      if (keys.length > 1) {
        throw new Error(`Argument should be a single item object.`);
      }

      const first_key = keys[0];
      const first_value = Object.values(arg)[0];

      if (first_key.startsWith("@media")) {
        const media = first_key;
        const block = first_value;
        const media_rule = this.#create_and_append_rule(media);
        for (const [selector, items] of Object.entries(block)) {
          if (items === undefined) {
            continue;
          }
          media_rule.insertRule(`${selector} {}`);
          const rule = media_rule.cssRules[0];
          this.#update_rule(rule, items);
        }
      } else if (first_key.startsWith("@keyframes")) {
        const keyframe = first_key;
        const block = first_value;
        const keyframe_rule = this.#create_and_append_rule(keyframe);
        for (const [key, items] of Object.entries(block)) {
          if (items === undefined) {
            continue;
          }
          const text = this.#create_rule_text(key, items);
          keyframe_rule.appendRule(text);
        }
      } else {
        const selector = first_key;
        const items = first_value;
        const rule = this.#create_and_append_rule(selector);
        this.#update_rule(rule, items);
      }
    }
    return this;
  };

  #create_and_append_rule = (selector) => {
    const index = this.#sheet.insertRule(`${selector} {}`, this.size);
    const rule = this.#sheet.cssRules[index];
    return rule;
  };

  #create_rule_text = (key, items) => {
    const text = `${key} { ${Object.entries(items)
      .map(([key, value]) => `${camel_to_kebab(key)}: ${value};`)
      .join(" ")} }`;
    return text;
  };

  #update_rule = (rule, items) => {
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

/*
EXAMPLE
import { create } from "rollo/component";
import { Sheet } from "rollo/components/sheet";


create("h1", { parent: root }, "Hello World");
create("h2", { parent: root }, "Also hello from here");

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


root.append(sheet_1);




*/
