export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
      const owner = this;
      this.#_.attrs = new (class {
        /* Returns attr value. */
        get(name) {
          name = kebab(name);
          /* By convention, non-present attrs are interpreted as null */
          if (!owner.hasAttribute(name)) {
            return null;
          }
          const value = owner.getAttribute(name);
          /* By convention, value-less attrs are interpreted as true */
          if (value === "") {
            return true;
          }
          /* By convention, values that can be interpreted as numbers are interpreted as 
            numbers */
          const number = Number(value);
          return isNaN(number) ? value || true : number;
        }

        /* Checks, if attr set. */
        has(name) {
          name = kebab(name);
          return owner.hasAttribute(name);
        }

        /* Sets one or more attr values. Chainable with respect to component. */
        set(spec = {}) {
          Object.entries(spec).forEach(([name, value]) => {
            name = kebab(name);

            /* By convention, false and null removes */
            if ([false, null].includes(value)) {
              owner.removeAttribute(value);
            } else if (
              value === true ||
              !["number", "string"].includes(typeof value)
            ) {
              /* By convention, non-primitive values sets value-less attr */
              owner.setAttribute(name, "");
            } else {
              owner.setAttribute(name, value);
            }
          });
          return owner;
        }
      })();

      this.#_.attr = new Proxy(this, {
        get(target, name) {
          return target.attrs.get(name);
        },
        set(target, name, value) {
          target.attrs.set({ [name]: value });
          return true;
        },
      });
    }

    /* Provides access to single attribute without use of strings. */
    get attribute() {
      return this.#_.attr;
    }

    /* Return attrs controller. */
    get attrs() {
      return this.#_.attrs;
    }
  };
};

/* Returns kebab-interpretation of camel-case string. */
function kebab(camel) {
  /* NOTE Digits are treated as lower-case characters, 
  i.e., p10 -> p10. */
  return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
