import { camel_to_kebab } from "rollo/utils/case";

/*
TODO
- a sheet can be disabled (native prop). Explore!
- use create. Expploit.
- Rename to css-static
- target should/could have a sheet controller to provide index of sheet in adopted -> refactor method for unadpot - perhaps flexible?
*/

/* Non-visual web component for managing static sheets dynamically applied.
  Notable features:
  - The sheet applies itself to its root node (document or a shadow root)
    dynamically as per the component's lifecycle (connect/disconnect).
  - Rules are created with standard object notation.
  */
export class Sheet extends HTMLElement {
  static create = (...args) => {
    return new Sheet(...args);
  };

  /* Removes first occurrence of item from array (strict equality). */
  /* TODO Move to  */
  static #remove_item = (arr, item) => {
    const index_to_remove = arr.indexOf(item);
    if (index_to_remove !== -1) {
      arr.splice(index_to_remove, 1);
    }
    return arr;
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
  }

  connectedCallback() {
    this.#target = this.getRootNode();

    if (this.#target.sheets) {
      // TODO
    }


    this.#target.adoptedStyleSheets.push(this.#sheet);
  }

  disconnectedCallback() {
    const index = document.adoptedStyleSheets.indexOf(this.#sheet);
    if (index !== -1) {
      document.adoptedStyleSheets.splice(index, 1);
    }
    this.#target = null;
  }

  get name() {
    return this.#name;
  }

  /* Returns the number of rules. */
  get size() {
    return this.#sheet.cssRules.length;
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
