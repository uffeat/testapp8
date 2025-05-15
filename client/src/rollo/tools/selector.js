/*
20250330
rollo/tools/selector.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/tools/selector.js
import {
  $,
  disabled,
  empty
  focus,
  invalid,
  selector,
  tag,
} from "rollo/tools/selector";

A suite of utils for for composing selector strings with minimal use of string literals.
Useful for, e.g., element query and CSS rule construction.

The utils fall in two categories:
- Utils for modifying a single selector string.
- The 'selector' util for composing complex selector strings. 

'select' is general purpose, but slightly more verbose that the single-selector utils.
Use 'select' in combination with single-selector utils for a leaner syntax.

The two categories overlap on some points.
*/

/* Returns object, from which a class selector string can be retrieved.
NOTE
- Converts from snake to kebab-case, except for any leading '_', 
  which is left untouched. */
export const $ = new Proxy(
  {},
  {
    get(target, key) {
      return `.${convert_key(key)}`;
    },
  }
);

/* Returns selector with 'disabled' pseudo-selector added. */
export const disabled = (selector) => `${String(selector)}:disabled`;

/* Returns selector with 'empty' pseudo-selector added. */
export const empty = (selector) => `${String(selector)}:empty`;

/* Returns selector with 'focus' pseudo-selector added. */
export const focus = (selector) => `${String(selector)}:focus`;

/* Returns selector with 'invalid' pseudo-selector added. */
export const invalid = (selector) => `${String(selector)}:invalid`;

/* Returns object, from which an element selector string can be retrieved.
NOTE
- Converts from snake to kebab-case. */
export const tag = new Proxy(
  {},
  {
    get(target, key) {
      key = key.replaceAll("_", "-");
      return key;
    },
  }
);

/* Util for composing selector strings with minimal use of string literals. 
NOTE
- Concept: A base selector string is provided initially (default: '*'). 
  This base selector can then be built up with chainable methods. 
  To use the resulting selector, a few options exist:
  - Use String(instance)
  - Use instance.selector
  - Use instance.text()
  - Rely on implicit string conversion, if used in an object context.  
- Can be used in combination with other selector and value realted utils. */
export const selector = (selector = "*") =>
  new (class Selector {
    #selector;
    constructor(selector) {
      this.#selector = selector;
    }

    /* Returns type.
    NOTE
    - Since 'Selector' is not exposed, 'type' provides a soft alternative 
      to using 'instanceof'. 
    - Likely only relevant for special cases... */
    get __type__() {
      /* TODO Consider purging. */
      return "selector";
    }

    /* Returns selector. */
    get selector() {
      return this.#selector;
    }

    /* Returns selector, when cast as string. */
    toString() {
      return this.#selector;
    }

    /* Adds class selectors from object to selector. Chainable.
    NOTE
    - Keys are converted to kebab-case, except for any leading '_', 
      which are left untouched. 
    - true values adds class selector.
    - false and null values wraps the class selector in a ':not' 
      "pseudo-function". */
    $(object) {
      let result = "";
      for (let [key, value] of Object.entries(object)) {
        key = convert_key(key);
        if (value === true) {
          result += `.${key}`;
          continue;
        }
        if ([false, null].includes(value)) {
          result += `:not(.${key})`;
          continue;
        }
      }
      this.#selector = `${this.#selector}${result}`;
      return this;
    }

    /* Adds attribute selectors from object to selector. Chainable.
    NOTE
    - Keys are converted to kebab-case, except for any leading '_', 
      which are left untouched. 
    - true values adds attribute selector.
    - false and null values wraps the attribute selector in a ':not' 
      "pseudo-function". */
    attr(object) {
      let result = "";
      for (let [key, value] of Object.entries(object)) {
        key = convert_key(key);
        if (value === true) {
          result += `[${key}]`;
          continue;
        }
        if ([false, null].includes(value)) {
          result += `:not([${key}])`;
          continue;
        }
        result += `[${key}="${value}"]`;
      }
      this.#selector = `${this.#selector}${result}`;
      return this;
    }

    /* Adds one or more child selectors to selector. Chainable. */
    child(...selectors) {
      /* TODO Consider, if support for, e.g., '>' should be implemented 
      (likely not critical). */
      let result = "";
      for (const selector of selectors) {
        /* Explicitly wrap in String, since selector arg may be a Selector 
        instance. */
        result += ` ${String(selector)}`;
      }
      this.#selector = `${this.#selector}${result}`;
      return this;
    }

    /* Adds 'disabled' pseudo-selector to selector. Chainable. */
    disabled() {
      this.#selector = `${this.#selector}:disabled`;
      return this;
    }

    /* Adds 'empty' pseudo-selector to selector. Chainable. */
    empty() {
      this.#selector = `${this.#selector}:empty`;
      return this;
    }

    /* Adds 'focus' pseudo-selector to selector. Chainable. */
    focus() {
      this.#selector = `${this.#selector}:focus`;
      return this;
    }

    /* Adds 'invalid' pseudo-selector to selector. Chainable. */
    invalid() {
      this.#selector = `${this.#selector}:invalid`;
      return this;
    }

    /* Adds 'has' "pseudo-selector function" to selector. Chainable. */
    has(selector) {
      /* Explicitly wrap in String, since selector arg may be a Selector 
      instance. */
      this.#selector = `${this.#selector}:has(${String(selector)})`;
      return this;
    }

    /* Adds 'not' "pseudo-selector function" to selector. Chainable. */
    not(selector) {
      /* Explicitly wrap in String, since selector arg may be a Selector instance. */
      this.#selector = `${this.#selector}:not(${String(selector)})`;
      return this;
    }

    /* Returns selector.
    NOTE
    - Alternative to 'String(instance)' and 'instance.selector'. */
    text() {
      return this.#selector;
    }
  })(selector);

/* Returns kebab-base interpretation of key. Any leading '_' is left untouched. */
function convert_key(key) {
  if (key.startsWith("_")) {
    key = `_${key.slice(1).replaceAll("_", "-")}`;
  } else {
    key = key.replaceAll("_", "-");
  }
  return key;
}

