

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

/*
TODO css_classes.add/css_classes.remove/css_classes.has syntax
*/

/* Factory for all web components. */
export const css_classes = (parent) => {
  const cls = class CssClasses extends parent {
    constructor(...args) {
      super(...args);
    }
    /* Adds one or more css classes.  
    args can be:
    - Individual css class names
    - String with multiple css class names separated by '.'
    - Arrays of css class names
    undefined handlers are ignored to support iife's. 
    Chainable. */
    add_css(...args) {
      for (const css_classes of args) {
        if (css_classes && css_classes.length > 0) {
          if (Array.isArray(css_classes)) {
            this.classList.add(
              ...css_classes.filter((c) => c).map((c) => camel_to_kebab(c))
            );
          } else {
            this.classList.add(
              ...css_classes
                .split(".")
                .filter((c) => c)
                .map((c) => camel_to_kebab(c))
            );
          }
        }
      }
      return this;
    };

    

    
  };
  return cls;
};
