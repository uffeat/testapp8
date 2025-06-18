/*
import classes from "@/rollocomponent/mixins/classes.js";
20250602
v.1.2
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "classes";
    #_ = {};
    constructor() {
      super();
      const owner = this;
      this.#_.classes = new (class {
        /* Returns classList (for advanced use). */
        get list() {
          return owner.classList;
        }

        /* Adds classes. Chainable with respect to component. */
        add(classes) {
          classes && owner.classList.add(...classes.split("."));
          return owner;
        }

        /* Removes all classes. Chainable with respect to component. */
        clear() {
          for (const c of Array.from(owner.classList)) {
            owner.classList.remove(c);
          }
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

    /* Updates CSS classes from '.'-syntax. Chainable. */
    update(updates = {}) {
      super.update?.(updates);

      for (let [key, value] of Object.entries(updates)) {
        /* Ignore, if not special syntax */
        if (!key.startsWith(".")) {
          continue;
        }
        /* Adjust for special syntax */
        key = key.slice(".".length);
        /* Handle function values */
        if (typeof value === "function") {
          value = value.call(this, key);
        }
        /* Ignore undefined value to, e.g., for efficient use of iife's */
        if (value === undefined) {
          continue;
        }
        /* Update */
        this.classes[value ? "add" : "remove"](key);
      }
      return this;
    }
  };
};

/* TODO
- If ever needed: Relatively easy to make classes reactive, by event dispatch. */
