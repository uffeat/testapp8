/*
import attrs from "@/rollocomponent/mixins/attrs.js";
20250602
v.1.2
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
      const owner = this;
      const _attributes = super.attributes;
      this.#_.attributes = new (class {
        /* Returns attributes NamedNodeMap (for advanced use). */
        get attributes() {
          return _attributes;
        }

        /* Returns number of set attributes. */
        get size() {
          return _attributes.length;
        }

        /* Returns attribute entries. */
        entries() {
          return Array.from(_attributes, (item) => [
            item.name,
            this.#interpret(item.value),
          ]);
        }

        /* Returns attribute value. */
        get(name) {
          name = kebab(name);
          /* By convention, non-present attrs are interpreted as null */
          if (!owner.hasAttribute(name)) {
            return null;
          }
          const value = owner.getAttribute(name);
          return this.#interpret(value);
        }

        /* Checks, if attribute set. */
        has(name) {
          name = kebab(name);
          return owner.hasAttribute(name);
        }

        /* Returns attribute keys (names). */
        keys() {
          return Array.from(_attributes, (item) => item.name);
        }

        /* Sets one or more attribute values. Chainable with respect to component. */
        set(name, value) {
          /* Abort, if undefined value to, e.g., for efficient use of iife's */
          if (value === undefined) {
            return owner;
          }
          /* Normalize name */
          name = kebab(name);
          /* Handle function values */
          if (typeof value === "function") {
            const result = value.call(owner, name);
            if (result !== undefined) {
              value = result;
            }
          }
          /* Abort, if no change */
          const current = this.#interpret(owner.getAttribute(name));
          if (value === current) {
            return owner;
          }
          /* Update */
          if ([false, null].includes(value)) {
            /* By convention, false and null removes */
            owner.removeAttribute(name);
          } else if (
            value === true ||
            !["number", "string"].includes(typeof value)
          ) {
            /* By convention, non-primitive values sets value-less attribute */
            owner.setAttribute(name, "");
          } else {
            owner.setAttribute(name, value);
          }
          return owner;
        }

        /* Updates one or more attribute values. Chainable with respect to component. */
        update(updates = {}) {
          Object.entries(updates).forEach(([name, value]) => {
            this.set(name, value);
          });
          return owner;
        }

        /* Returns attribute values (interpreted). */
        values() {
          return Array.from(_attributes, (item) => item.value);
        }

        #interpret(value) {
          /* By convention, value-less attributes are interpreted as true */
          if (value === "") {
            return true;
          }
          /* By convention, values that can be interpreted as numbers are 
          interpreted as numbers */
          const number = Number(value);
          return isNaN(number) ? value || true : number;
        }
      })();

      this.#_.attribute = new Proxy(this, {
        get(target, name) {
          return target.attributes.get(name);
        },
        set(target, name, value) {
          target.attributes.set(name, value);
          return true;
        },
      });
    }

    /* Provides access to single attribute without use of strings. */
    get attribute() {
      return this.#_.attribute;
    }

    /* Return attributes controller. */
    get attributes() {
      return this.#_.attributes;
    }

    /* Updates attributes from '['-syntax. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      this.attributes.update(
        Object.fromEntries(
          Object.entries(updates)
            .filter(([k, v]) => k.startsWith("["))
            .map(([k, v]) => [k.slice("[".length), v])
        )
      );
      return this;
    }
  };
};

/* Returns kebab-interpretation of camel-case string. */
function kebab(camel) {
  /* NOTE Digits as lower-case, e.g., p10 -> p10. */
  return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/* TODO
- If ever needed: Relatively easy to store attributes (current and previous) in 
  custom registry. This could track changes and only make updates, if actual 
  change. Could also be a step towards component serialization/deserialization.
- If ever needed: Relatively easy to make attributes reactive, by event 
  dispatch. This could be an elegant and more efficient alternative to 
  observing attribute changes.  */
