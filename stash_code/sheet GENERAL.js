import { camel_to_kebab } from "rollo/utils/case";

/* Non-visual web component for managing dynamically applied sheets.
  Notable features:
  - The sheet applies itself to its root node (document or a shadow root)
    dynamically as per the component's lifecycle (connect/disconnect).
  - Supported rules:
    - Standard.
    - CSS var declarations.
    - rules with '!important' values.
    - Media.
    - Keyframe.
  - Rules can be appended with standard object notation and a syntax that 
    resembles native CSS with optional camel case keys. Alternatively,
    the sheet can be defined from text.
  - Supports hooks and iifee's, when appending rules.
  - The component is per se not intended for dynamic rule manipulation.
    However, the API makes it relatively easy for other objects to do that.
    Notably, the 'rules.create' and 'rules.update' methods are provided
    for such purpose.
  - For the purpose of extensions, the component has a shadow root with a 
    single slot element.
*/
export class SheetComponent extends HTMLElement {
  static create = (...args) => {
    return new SheetComponent(...args);
  };
  static observedAttributes = ["disabled", "name"];
  #name;
  #sheet = new CSSStyleSheet();
  #slot = document.createElement("slot");
  #target;

  constructor({ name } = {}, ...args) {
    super();
    this.style.display = "none";
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this.#slot);
    if (name) {
      this.#name = name;
      this.setAttribute("name", name);
    }
    this.rules.append(...args);
  }

  connectedCallback() {
    super.created_callback && super.created_callback(...args);
    this.#target = this.getRootNode();
    this.#target.adoptedStyleSheets.push(this.#sheet);
  }

  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();
    const index = document.adoptedStyleSheets.indexOf(this.#sheet);
    if (index !== -1) {
      document.adoptedStyleSheets.splice(index, 1);
    }
    this.#target = null;
  }

  /* TODO
  Consider purging and instead rely on one-way prop -> attr reflection discipline. */
  attributeChangedCallback(name, previous, current) {
    super.attributeChangedCallback &&
      super.attributeChangedCallback(name, previous, current);
    if (name === "disabled") {
      if (current === null) {
        current = false;
      } else if (current === "") {
        current = true;
      } else {
        throw new Error(`Invalid value of 'disabled' attribute: ${current}`);
      }
      if (this.disabled !== current) {
        console.error(
          `'disabled' not in sync with the disabled state sheet. Reverting to synced value.`
        );
        this.#sync_disabled_attribute();
      }
    }
    if (name === "name") {
      if (this.name !== current) {
        console.error(
          `'name' not in sync with property. Reverting to synced value.`
        );
        this.setAttribute("name", this.name);
      }
    }
  }

  get disabled() {
    return this.#sheet.disabled;
  }

  set disabled(disabled) {
    this.#sheet.disabled = disabled;
    this.#sync_disabled_attribute();
  }
  #sync_disabled_attribute = () => {
    if (this.#sheet.disabled) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  };

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

    /* Appends rules from ocjects. Supports hooks and iife's.  */
    append = (...args) => {
      return this.#owner.#append_rules(...args);
    };

    /* Creates and returns rule with selector, but no items. */
    create = (selector) => {
      return this.#owner.#create_and_append_rule(selector);
    };

    /* Returns rule text from key ("selector") and items object.
    Useful for rules that do not support 'style.setProperty'.  */
    create_text = (key, items) => {
      return this.#owner.#create_rule_text(key, items);
    };

    /* Updates rules from items object. */
    update = (rule, items) => {
      this.#owner.#update_rule(rule, items);
    };
  })(this);

  get sheet() {
    return this.#sheet;
  }

  get slot() {
    return this.#slot;
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

      const keys = Object.keys(arg);
      if (keys.length > 1) {
        throw new Error(`Argument should be a single item object.`);
      }
      /* arg is a single-item object */

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

customElements.define("sheet-component", SheetComponent);

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
