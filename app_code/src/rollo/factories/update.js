const $ = "$";
const CSS_VAR = "__";
const ON = "on_";

/* Returns kebab-interpretation of camel.
First digit in digit sequences are treated as upper-case characters,
i.e., p10 -> p-10. This often (but not always) the desired behaviour, 
when dealing with css classes. */
function camel_to_kebab(camel) {
  return camel
    .replace(/([a-z])([A-Z0-9])/g, "$1-$2")
    .replace(/([0-9])([a-zA-Z])/g, "$1-$2")
    .toLowerCase();
}

/* Factory for all web components. */
export const update = (parent) => {
  const cls = class Update extends parent {
    constructor(...args) {
      super(...args);
    }

    

    /* Updates properties, attributes, css classes, css vars and handlers. 
    Chainable. */
    update({ attributes, css, ...updates } = {}) {
      /* Props */
      this.#update_properties(updates);
      /* Attributes */
      this.#update_attributes(attributes);
      /* CSS classes */
      this.#update_css(css);
      /* CSS vars */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(CSS_VAR))
        .forEach(
          ([key, value]) => (this.__[key.slice(CSS_VAR.length)] = value)
        );
      /* Handlers */
      this.#add_handlers(updates);
      return this;
    }

    /* Adds one or more event handlers from object. 
    Keys should be prefixed with 'on_'.
    undefined handlers are ignored to support iife's.
    Chainable.
    Example: 
    my_component.add_handlers({on_click: () => console.log('Clicked!')})
    */
    #add_handlers = (updates) => {
      if (updates) {
        Object.entries(updates)
          .filter(([key, value]) => value !== undefined && key.startsWith(ON))
          .forEach(([key, value]) =>
            this.addEventListener(key.slice(ON.length), value)
          );
      }
      return this;
    };

    

    /* Updates one or more element attributes from object. 
    Items with undefined values are ignored to support iife's.
    Items with false values removes the attribute.
    Items with true values add no-value attribute. 
    Chainable. */
    #update_attributes = (attributes) => {
      if (attributes) {
        Object.entries(attributes)
          .filter(([key, value]) => value !== undefined)
          .forEach(([key, value]) => {
            const attr_key = camel_to_kebab(key);
            if (value === true) {
              this.setAttribute(attr_key, "");
            } else if ([false, null].includes(key)) {
              this.removeAttribute(attr_key);
            } else {
              this.setAttribute(attr_key, value);
            }
          });
      }
      return this;
    };

    /* Updates one or more css classes from object. 
    Items with undefined values are ignored to support iife's.
    Items with false values removes the css class.
    Items with true values adds the css class. 
    Camel-case keys are converted to kebab. 
    Chainable. */
    #update_css = (css) => {
      if (css) {
        if (Array.isArray(css) || typeof css === "string") {
          add_css.call(this, css);
        } else {
          Object.entries(css)
            .filter(([key, value]) => value !== undefined)
            .forEach(([key, value]) => {
              this.classList[value ? "add" : "remove"](camel_to_kebab(key));
            });
        }
      }
      return this;
    };

    /* Updates one or more props from object. 
    Keys with shorthand prefixed are ignored.
    Items with undefined values are ignored to support iife's.
    Items with '_'-prefixed keys are allowed.
    Items with keys that match a style key are added to the style object.
    Items with other invalid keys throws an error.
    Chainable. */
    #update_properties = (updates) => {
      if (updates) {
        Object.entries(updates)
          .filter(
            ([key, value]) =>
              value !== undefined &&
              !key.startsWith($) &&
              !key.startsWith(ON) &&
              !key.startsWith(CSS_VAR)
          )
          .forEach(([key, value]) => {
            if (key.startsWith("_")) {
              this[key] = value;
            } else if (key in this) {
              this[key] = value;
            } else if (key in this.style) {
              this.style[key] = value;
            } else {
              throw new Error(`Invalid key: ${key}`);
            }
          });
      }
      return this;
    };
  };
  return cls;
};
