import { Reactive } from "rollo/reactive";
import { shadow } from "rollo/_factories/shadow";
import { text } from "rollo/_factories/text";
import { chain } from "rollo/_factories/chain";
import { children } from "rollo/_factories/children";

/* Uility for composing and registering non-autonomous web components on demand. */
export const component = new (class {
  get registry() {
    return this.#registry;
  }
  #registry = new (class Registry {
    #registry = {};
    /*  */
    add = (tag, cls) => {
      customElements.define(`native-${tag}`, cls, {
        extends: tag,
      });
      this.#registry[tag] = cls;
      return cls;
    };
    /*  */
    get = (tag) => {
      return this.#registry[tag];
    };
  })();

  get factories() {
    return this.#factories;
  }
  #factories = new (class Factories {
    #registry = [];
    /* Registers conditional web component class factory */
    add = (condition, factory) => {
      this.#registry.push([condition, factory]);
    };
    /* Returns factories relevant for a given tag */
    get = (tag) => {
      return this.#registry
        .filter(([condition, factory]) => condition(tag))
        .map(([condition, factory]) => factory);
    };
  })();

  /* Returns instance of non-autonomous web component  */
  create = (arg = null, updates = {}, ...children) => {
    let tag = "div";
    let css_classes;
    if (arg) {
      /* Extract tag and css_classes from arg */
      const arg_parts = arg.split(".");
      tag = arg_parts.shift();
      css_classes = arg_parts;
    }
    const element = new (this.get(tag))(updates, ...children);
    /* Add css classes */
    if (css_classes && css_classes.length > 0) {
      /* NOTE Condition avoids adding empty class attr */
      element.classList.add(...css_classes);
    }

    element.update(updates);

    for (const child of children) {
      if (typeof child === "function") {
        const result = child.call(element);
        if (result === undefined) {
          continue;
        }
        if (Array.isArray(result)) {
          element.append(...result);
        } else {
          element.append(result);
        }
        continue;
      }
      element.append(child);
    }

    return element;
  };

  /* Returns non-autonomous web component class. */
  get = (tag) => {
    let cls = this.registry.get(tag);
    if (cls) {
      return cls;
    }
    const native = document.createElement(tag).constructor;
    if (native === HTMLUnknownElement) {
      throw new Error(`Invalid tag: ${tag}`);
    }
    const factories = this.factories.get(tag);
    cls = this.author(native, ...factories);
    return this.registry.add(tag, cls);
  };

  /* Builds and returns web component class from native base and factories. */
  author = (native, ...factories) => {
    let cls = this.#base(native);
    const names = [cls.name];
    const chain = [native, cls];
    for (const factory of factories) {
      cls = factory(cls);
      if (names.includes(cls.name)) {
        console.warn(
          `Factory class names should be unique for better traceability. Got duplicate: ${cls.name}`
        );
      }
      names.push(cls.name);
      chain.push(cls);
    }

    /* Create __chain__ as instance prop that returns a frozen array of prototypes in mro.
    NOTE __chain__ represents the prototype chain as created here. 
    If the chain is subsequently tinkred with, use the 'chain' prop provided by the chain factory. */
    const __chain__ = Object.freeze(chain.reverse());
    Object.defineProperty(cls.prototype, "__chain__", {
      configurable: true,
      enumerable: false,
      get: function () {
        return __chain__;
      },
    });

    return cls;
  };

  /* Returns base factory to be used for all web components. */
  #base = (native) => {
    function camel_to_kebab(camel) {
      return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }
    /* Base factory that 'component' relies on */
    const cls = class ReactiveBase extends native {
      #set_connected;
      constructor(...args) {
        super(...args);
        /* Identify as web component. */
        this.setAttribute("web-component", "");
        this.#set_connected = this.reactive.protected.add("connected");
      }

      connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        this.#set_connected(true);
        this.dispatchEvent(new Event("connected"));
      }

      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback();
        this.#set_connected(false);
        this.dispatchEvent(new Event("disconnected"));
      }

      /* Provides external access to super. */
      get __super__() {
        return this.#__super__;
      }
      #__super__ = new Proxy(this, {
        get: (target, key) => {
          return super[key];
        },
        set: (target, key, value) => {
          super[key] = value;
          return true;
        },
      });

      /* Returns an object, from which single state items can be retrieved 
      and set to trigger effects. */
      get $() {
        return this.#reactive.$;
      }

      /* Getter/setter interface for component-scoped css vars. */
      get __() {
        return this.#__;
      }
      #__ = new Proxy(this, {
        get(target, key) {
          /* 
      TODO 
      Perhaps provide additional ways to retrieve css var?
      Not sure, if the current approach is adequate, if css var has been set inline?
      Do some testing to check...  
      */
          return getComputedStyle(target).getPropertyValue(`--${key}`).trim();
        },
        set(target, key, value) {
          if (typeof value === "function") {
            value = value.call(target);
          }
          if (value === undefined) return true;
          if (value) {
            target.style.setProperty(`--${key}`, value);
          } else {
            target.style.removeProperty(`--${key}`);
          }
          return true;
        },
      });

      /* Getter/setter interface to attributes. */
      get attribute() {
        return this.#attribute;
      }
      #attribute = new Proxy(this, {
        get(target, key) {
          key = camel_to_kebab(key);
          if (!target.hasAttribute(key)) {
            return null;
          }
          const value = target.getAttribute(key);
          if (value === "") {
            return true;
          }
          const number = Number(value);
          if (typeof number === "number" && number === number) {
            return number;
          }
          return value;
        },
        set(target, key, value) {
          if (typeof value === "function") {
            value = value.call(target);
          }
          if (value === undefined) return true;
          key = camel_to_kebab(key);
          if ([false, null].includes(value)) {
            /* Remove attr */
            target.removeAttribute(key);
            return true;
          }
          if (["", true].includes(value)) {
            /* Set no-value attr */
            target.setAttribute(key, "");
            return true;
          }
          /* Set value attr */
          if (!["number", "string"].includes(typeof value)) {
            throw new Error(`Invalid attr value: ${value}`);
          }
          target.setAttribute(key, value);
          return true;
        },
      });

      /* Getter/setter interface to css classes. */
      get css() {
        return this.#css;
      }
      #css = new Proxy(this, {
        get(target, css_class) {
          return target.classList.contains(css_class);
        },
        set(target, css_class, value) {
          if (typeof value === "function") {
            value = value.call(target);
          }
          if (value === undefined) return true;
          if (value) {
            target.classList.add(css_class);
          } else {
            target.classList.remove(css_class);
          }
          return true;
        },
      });

      /* Returns controller for managing effects. */
      get effects() {
        return this.#reactive.effects;
      }

      /* Syntactic sugar for event handler registration. */
      get on() {
        return this.#on;
      }
      #on = new Proxy(this, {
        get() {
          throw new Error(`'on' is write-only.`);
        },
        set(target, type, handler) {
          target.addEventListener(type, handler);
          return true;
        },
      });

      get parent() {
        return this.parentElement;
      }

      set parent(parent) {
        if (typeof parent === "function") {
          parent = parent.call(this);
        }
        if (parent === undefined) return;
        if (parent === null) {
          this.remove();
        } else if (this.parentElement !== parent) {
          parent.append(this);
        }
      }

      /* Exposes reactive instance for full access */
      get reactive() {
        return this.#reactive;
      }
      #reactive = Reactive.create(null, { owner: this });

      /* Appends children. Chainable.
      NOTE Overloads native 'append', so that:
      - undefined values are ignored.
      - arrays of children can be passed in without spread syntax. */
      append = (...children) => {
        for (const child of children) {
          if (child === undefined) {
            continue;
          }
          if (Array.isArray(child)) {
            child.forEach((c) => this.append(c));
            continue;
          }
          super.append(child);
        }
        return this;
      };

      /* Returns array of unique descendant elements that match ANY selectors. 
      Returns null, if no matches.
      A more versatile alternative to querySelectorAll with a return value 
      that array methods can be used directly on (unless null) */
      get = (...selectors) => {
        const elements = [
          ...new Set(
            selectors
              .map((selector) => [...this.querySelectorAll(selector)])
              .flat()
          ),
        ];
        return elements.lenght === 0 ? null : elements;
      };

      /* Dispatches custom event and returns detail. */
      send = (type, { detail, ...options } = {}) => {
        this.dispatchEvent(new CustomEvent(type, { detail, ...options }));
        /* NOTE If detail is mutable, it's handy to get it back, 
        since handler may have mutated it. This enables two-way communication 
        between event target and handler. */
        return detail;
      };

      /* Updates props, attributes and state. Chainable. */
      update = (updates) => {
        const $ = "$";
        const ATTR = "attr_";
        const CSS_CLASS = ".";
        const CSS_VAR = "__";
        const ON = "on_";

        /* Props */
        Object.entries(updates)
          .filter(
            ([key, value]) =>
              !key.startsWith($) &&
              !key.startsWith(ATTR) &&
              !key.startsWith(ON) &&
              !key.startsWith(CSS_CLASS) &&
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

        /* Attributes */
        Object.entries(updates)
          .filter(([key, value]) => key.startsWith(ATTR))
          .forEach(
            ([key, value]) => (this.attribute[key.slice(ATTR.length)] = value)
          );

        /* CSS classes */
        Object.entries(updates)
          .filter(([key, value]) => key.startsWith(CSS_CLASS))
          .forEach(([key, value]) => (this.css[key.slice(CSS_CLASS.length)] = value));

        /* CSS vars */
        Object.entries(updates)
          .filter(([key, value]) => key.startsWith(CSS_VAR))
          .forEach(([key, value]) => (this.__[key.slice(CSS_VAR.length)] = value));

        /* Handlers */
        Object.entries(updates)
          .filter(([key, value]) => key.startsWith(ON))
          .forEach(([key, value]) => (this.on[key.slice(ON.length)] = value));

        /* Reactive state */
        const state = Object.fromEntries(
          Object.entries(updates)
            .filter(([key, value]) => key.startsWith($))
            .map(([key, value]) => [key.slice(1), value])
        );
        this.reactive.update(state);
        return this;
      };
    };
    return cls;
  };
})();

export const create = component.create;

component.factories.add(...shadow);
component.factories.add(...text);
component.factories.add(...chain);
component.factories.add(...children);
