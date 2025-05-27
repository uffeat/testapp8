/* 
20250421
src/rollo/component/factories/classes.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/classes.js
import { classes } from "rollo/component/factories/classes.js";
*/

import { constants } from "@/rollo/component/tools/constants.js";
//const { constants } = await modules.get("@/rollo/component/tools/constants.js");

const { CSS_CLASS } = constants;

export const classes = (parent, config, ...factories) => {
  return class extends parent {
    static name = "classes";
    #classes;

    __new__() {
      super.__new__?.();
      this.#classes = new (class Classes {
        #owner;
        constructor(owner) {
          this.#owner = owner;
        }
        /* Returns owner component. */
        get owner() {
          return this.#owner;
        }
        add(...strings) {
          /* Allow use of ternaries and iife's in method call */
          strings = strings.filter((s) => s);
          /* Create array of new classes and add these */
          const added = this.#add(
            this.#uniquify(strings.flatMap(this.#arraify)).filter(
              this.#is_inactive
            )
          );
          /* Notify re class additions */
          this.#send({ added });
          /* Make chainable with respect to owner */
          return this.owner;
        }
        if(condition, ...strings) {
          if (condition) {
            this.add(...strings);
          } else {
            this.remove(...strings);
          }
          return this.owner;
        }
        has(...strings) {
          /* Use for-loops to "fail fast" */
          for (const s of strings) {
            for (const c of this.#arraify(s)) {
              if (this.#is_inactive(c)) return false;
            }
          }
          return true;
        }
        remove(...strings) {
          /* Allow use of ternaries and iife's in method call */
          strings = strings.filter((s) => s);
          /* Create array of active classes and remove these */
          const removed = this.#remove(
            this.#uniquify(strings.flatMap(this.#arraify)).filter(
              this.#is_active
            )
          );
          /* Notify re class removals */
          this.#send({ removed });
          /* Make chainable with respect to owner */
          return this.owner;
        }
        replace(remove, add) {
          const detail = {};
          /* Testing add/remove allows use of ternaries and iife's in method call */
          if (remove) {
            /* Create array of active classes and remove these */
            detail.removed = this.#remove(
              this.#arraify(remove).filter(this.#is_active)
            );
          }
          if (add) {
            /* Create array of new classes and add these */
            detail.added = this.#add(
              this.#arraify(add).filter(this.#is_inactive)
            );
          }
          /* Notify re class changes
          NOTE By not using add/remove, event-firing is kept at a minimum. */
          this.#send(detail);
          /* Make chainable with respect to owner */
          return this.owner;
        }
        toggle(...strings) {
          /* Allow use of ternaries and iife's in method call */
          strings = strings.filter((s) => s);
          /* Create array unique classes */
          const classes = this.#uniquify(strings.flatMap(this.#arraify));
          /* Create array of new classes and add these */
          const added = this.#add(classes.filter(this.#is_inactive));
          /* Create array of active classes and remove these */
          const removed = this.#remove(classes.filter(this.#is_active));
          /* Notify re class changes
          NOTE By not using add/remove, event-firing is kept at a minimum. */
          this.#send({ added, removed });
          /* Make chainable with respect to owner */
          return this.owner;
        }
        /* Adds classes from array and returns array */
        #add(array) {
          this.owner.classList.add(...array);
          return array;
        }
        /* Returns array-interpretation of CSS-class string.  */
        #arraify = (s) => s.split(".");
        #is_active = (c) => this.owner.classList.contains(c);
        /* */
        #is_inactive = (c) => !this.owner.classList.contains(c);
        /* Removes classes from array and returns array */
        #remove(array) {
          this.owner.classList.remove(...array);
          return array;
        }
        /* Dispatches 'css_classes' event with deep-frozen detail from owner. */
        #send(detail) {
          if (detail.added) {
            Object.freeze(detail.added);
          }
          if (detail.removed) {
            Object.freeze(detail.removed);
          }
          Object.freeze(detail);
          this.owner.send("classes", { detail });
        }
        #uniquify = (array) => Array.from(new Set(array));
      })(this);
    }

    /* Returns controller for CSS classes.
    NOTE
    - Provides a string-based syntax for managing CSS classes, 
      where classes are specified as one or more strings, internally "."-separated.
      This brings working with classes closer to CSS and querySelector etc. 
    - Also, provides additional methods, e.g., for conditional class operations. */
    get classes() {
      return this.#classes;
    }

    /* Updates CSS classes. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(CSS_CLASS))
        .forEach(([k, v]) => this.classes.if(v, k.slice(CSS_CLASS.length)));
      return this;
    }
  };
};
