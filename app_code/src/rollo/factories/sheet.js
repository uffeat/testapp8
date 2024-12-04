/*
TODO
- media and animations
- Insert rule with var value for smoother updates
- Find a way to react to rules in force:
  - querySelector trigger by: ...
  - animation start event
  - rule also sets width of some dummy element that is watched by an intersection or resize observer
  - iframe

- #sheet should be a class, with a text prop and a create method
- Move validate back into rules and use __super__

*/
import { camel_to_kebab, kebab_to_camel } from "rollo/utils/case";

const create_scope = (() => {
  let count = 0;
  return () => {
    return `_scope${count++}`;
  };
})();

/* Factory for all web components. */
export const sheet = (parent, config, ...factories) => {
  const cls = class Sheet extends parent {
    #scope;
    #sheet;
    constructor(...args) {
      super(...args);
    }

    get style() {
      return this.#style;
    }
    #style = new Proxy(this, {
      get: (target, key) => {
        if (this.#sheet) {
          return target.rules.get("", key);
        }
        return target.__super__.style[key] || undefined;
      },
      set: (target, key, value) => {
        target.rules.update({ "": { [key]: value } });
        return true;
      },
    });

    /* Checks declaration key. */
    #validate_style_key = (key) => {
      if (!key.startsWith("--")) {
        if (!(key in super.style)) {
          throw new Error(`Invalid key: ${key}`);
        }
      }
    };

    #create_sheet = () => {
      if (!this.#sheet) {
        this.#sheet = new CSSStyleSheet();
        this.attribute.hasSheet = true;
        this.#scope = create_scope();
        /* Add effect to adopt/unadopt */
        this.effects.add((data) => {
          if (this.$.connected) {
            this.classList.add(this.#scope);
            console.log("Adopting sheet"); ////
            document.adoptedStyleSheets.push(this.#sheet);
          } else {
            const index = document.adoptedStyleSheets.indexOf(this.#sheet);
            if (index !== -1) {
              console.log("Unadopting sheet"); ////
              document.adoptedStyleSheets.splice(index, 1);
            }
            this.classList.add(this.#scope);
          }
        }, "connected");
      }
    };

    /* */
    get rules() {
      return this.#rules;
    }
    #rules = new (class {
      /* . */
      #owner;
      #registry = {};
      constructor(owner) {
        this.#owner = owner;
      }

      get = (selector, key) => {
        if (this.#owner.#sheet && selector in this.#registry) {
          const rule = this.#registry[selector];
          if (key) {
            const value = rule.style.getPropertyValue(key);
            return value;
          }
          const items = {};
          for (let i = 0; i < rule.styleMap.size; i++) {
            const key = rule.style[i];
            const value = rule.style.getPropertyValue(key);
            items[key] = value;
          }
          return items;
        }
      };

      update = (...rules) => {
        this.#owner.#create_sheet();
        for (const r of rules) {
          const selector = Object.keys(r)[0];
          const items = Object.values(r)[0];
          let rule;
          if (selector in this.#registry) {
            rule = this.#registry[selector];
          } else {
            const scoped_selector = `:is(.${this.#owner.#scope})${selector}`;
            const index = this.#owner.#sheet.insertRule(
              `${scoped_selector} {}`,
              this.#owner.#sheet.cssRules.length
            );
            rule = this.#owner.#sheet.cssRules[index];
            this.#registry[selector] = rule;
          }

          for (const [key, value] of Object.entries(items)) {
            this.#owner.#validate_style_key(key);

            if (value.endsWith("!important")) {
              rule.style.setProperty(
                camel_to_kebab(key),
                value.slice(0, -"!important".length).trim(),
                "important"
              );
            } else {
              if (selector === "") {
                //const css_var = `--${kebab_to_camel(key)}`;
                //rule.style.setProperty(css_var, value);
                //rule.style.setProperty(camel_to_kebab(key), `var(${css_var})`);
                rule.style.setProperty(camel_to_kebab(key), value); ////
              } else {
                rule.style.setProperty(camel_to_kebab(key), value);
              }
            }
          }
        }

        return this.#owner;
      };

      has = () => {};

      remove = (selector, key) => {
        if (selector in this.#registry) {
          rule = this.#registry[selector];
          if (key) {
            rule.style.removeProperty(key)
          } else {
            /* TODO */
          }
        }




        return this.#owner;
      };
    })(this);
  };
  return cls;
};
