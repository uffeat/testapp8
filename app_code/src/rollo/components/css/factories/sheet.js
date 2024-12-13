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
      this.effects.add(() => {
        if (this.connected) {
          this.target = this.getRootNode();
        } else {
          this.target = null;
        }
      }, "connected");

      /* Add effect to unadopt from/adopt to target */
      this.effects.add((changes, previous) => {
        /* Unadopt from any previous */
        if (previous.target) {
          /* Perform in-place mutation to minimize flickering */
          const index = previous.target.adoptedStyleSheets.indexOf(this.sheet);
          if (index !== -1) {
            previous.target.adoptedStyleSheets.splice(index, 1);
          }
        }
        /* Adopt to any new */
        if (this.target) {
          this.target.adoptedStyleSheets.push(this.sheet);
        }
      }, "target");
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

    /* Returns target state. */
    get target() {
      return this.$.target;
    }
    /* Sets target state. */
    set target(target) {
      if (target && !target.adoptedStyleSheets) {
        throw new Error(`Invalid target: ${target}`)
      }
      this.$.target = target
    }
   
  };
  return cls;
};
