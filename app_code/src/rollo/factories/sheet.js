import { check_factories } from "rollo/utils/check_factories";
import { attribute, connected, reactive } from "rollo/factories/__factories__";

/* . */
export const sheet = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, connected, reactive], factories);

  const cls = class Sheet extends parent {
    #target;

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      /* Adopt/unadopt as per connected/disconnected */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.#target = this.getRootNode();
          this.#target.adoptedStyleSheets.push(this.#sheet);
        } else {
          /* Perform in-place mutation of target's adoptedStyleSheets to minimize flickering */
          const index = this.#target.adoptedStyleSheets.indexOf(this.#sheet);
          if (index !== -1) {
            this.#target.adoptedStyleSheets.splice(index, 1);
          }
          this.#target = null;
        }
      }, "connected");
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

    /* Returns a text representation of the sheet.
    Primarily as a dev tool to check the sheet content. */
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
