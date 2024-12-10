import { check_factories } from "rollo/utils/check_factories";
import { attribute, connected } from "rollo/factories/__factories__";

/* Factory that wraps a constructed sheet.
Responsibilities:
- Adoption to/unadoption from a single target.
- Control sheet's 'disabled' state.
NOT concerned with sheet content. */
export const sheet = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, connected], factories);

  const cls = class Sheet extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      /* Create effect to update target */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.target = this.getRootNode();
        } else {
          this.target = null;
        }
      }, "connected");
    }

    /* Returns sheet's disabled state. */
    get disabled() {
      return this.sheet.disabled;
    }
    /* Sets sheet's disabled state. */
    set disabled(disabled) {
      this.sheet.disabled = disabled;
      /* Create one-way prop->attr reflection */
      this.attribute.disabled = disabled;
    }

    /* Returns sheet. */
    get sheet() {
      return this.#sheet;
    }
    #sheet = new CSSStyleSheet();

    /* Returns target. */
    get target() {
      return this.#target;
    }
    /* Unadopts sheet from any previous target and adopts sheet to any new 
    target. 
    NOTE
    Setting target directly is useful, if the component is not connected 
    to the live DOM. */
    set target(target) {
      /* Abort, if no change */
      if (this.#target === target) {
        return;
      }
      /* Unadopt from any previous */
      if (this.#target) {
        /* Perform in-place mutation to minimize flickering */
        const index = this.#target.adoptedStyleSheets.indexOf(this.sheet);
        if (index !== -1) {
          this.#target.adoptedStyleSheets.splice(index, 1);
        }
      }
      /* Adopt to any new */
      if (target) {
        target.adoptedStyleSheets.push(this.sheet);
      }
      /* Update private */
      this.#target = target;
    }
    #target;
  };
  return cls;
};
