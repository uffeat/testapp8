import { check_factories } from "rollo/utils/check_factories";
import {
  attribute,
  connected,
  reactive,
  
} from "rollo/factories/__factories__";

/* . */
export const rules = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, connected, reactive], factories);

  const cls = class Rules extends parent {
    #target;

    created_callback() {
      super.created_callback && super.created_callback();
      /* Adopt/unadopt as per connected/disconnected */
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
