/*
import classes from "@/rollocomponent/mixins/classes.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
      const owner = this;
      this.#_.classes = new (class {
        /* Retuns classList (for advanced use). */
        get list() {
          return owner.classList;
        }

        /* Adds classes. Chainable with respect to component. */
        add(classes) {
          classes && owner.classList.add(...classes.split("."));
          return owner;
        }

        /* Checks, if classes are present. */
        has(classes) {
          for (const c of classes.split(".")) {
            if (!owner.classList.contains(c)) {
              return false;
            }
          }
          return true;
        }

        /* Adds/removes classes according to condition. Chainable with respect 
        to component. */
        if(condition, classes) {
          this[!!condition ? "add" : "remove"](classes);
          return owner;
        }

        /* Removes classes. Chainable with respect to component. */
        remove(classes) {
          classes && owner.classList.remove(...classes.split("."));
          return owner;
        }

        /* Replaces classes with substitutes. Chainable with respect to component.
        NOTE
        - Mismatch between 'classes' and 'substitutes' sizes are (intentionally) 
        silently ignored. */
        replace(classes, substitutes) {
          classes = classes.split(".");
          substitutes = substitutes.split(".");
          for (let i = 0; i < classes.length; i++) {
            const substitute = substitutes.at(i);
            if (substitute === undefined) {
              break;
            } else {
              owner.classList.replace(classes[i], substitute);
            }
          }
          return owner;
        }

        /* Toggles classes. Chainable with respect to component. */
        toggle(classes, force) {
          for (const c of classes.split(".")) {
            owner.classList.toggle(c, force);
          }
          return owner;
        }
      })();
    }

    /* Returns constroller for managing CSS classes from '.'-separated strings. */
    get classes() {
      return this.#_.classes;
    }
  };
};
