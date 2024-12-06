import { Component } from "rollo/component";
import { camel_to_kebab } from "rollo/utils/case";


/* TODO
Rule items should be reactive */

/* Non-visual web component for dynamic rules.
  
*/
const factory = (parent) => {
  const cls = class Rule extends parent {
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

      this.effects.add((data) => {
        if (this.$.connected) {
          this.sheet = this.parentElement;
        } else {
          

          this.sheet = null;
        }
      }, "connected");
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
        Object.entries(items).filter(
          ([key, value]) => this.#items[key] !== value
        )
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
  };

  return cls;
};

Component.author("rule-component", HTMLElement, factory);

export const Rule = Component.registry.get("rule-component");
