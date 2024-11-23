import { Reactive } from "rollo/reactive";
import { shadow } from "@/rollo/factories/shadow";
import { text } from "@/rollo/factories/text";
import { chain } from "@/rollo/factories/chain";
import { children } from "@/rollo/factories/children";

const $ = "$";
const ATTR = "attr_";
const CSS_CLASS = "css_";
const CSS_VAR = "__";
const ON = "on_";

function camel_to_kebab(camel) {
  return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/* Utility for authoring web components and instantiating elements. */
export const component = new (class {
  get registry() {
    return this.#registry;
  }
  #registry = new (class Registry {
    #registry = {};
    /*  */
    add = (tag, cls) => {
      if (tag.includes("-")) {
        customElements.define(tag, cls);
        console.info(`Registered autonomous web component with tag '${tag}'.`);
      } else {
        customElements.define(`native-${tag}`, cls, {
          extends: tag,
        });
        console.info(
          `Registered non-autonomous web component extended from '${tag}'.`
        );
      }
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
    add = (factory, condition) => {
      this.#registry.push([factory, condition]);
    };
    /* Returns factories relevant for a given tag */
    get = (tag) => {
      return this.#registry
        .filter(([factory, condition]) => !condition || condition(tag))
        .map(([factory, condition]) => factory);
    };
  })();

  /* Builds, registers and returns web component from native base and factories. */
  author = (tag, native, ...factories) => {
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
    return this.registry.add(tag, cls);
  };

  /* Returns instance of web component  */
  create = (arg = null, updates = {}, ...children) => {
    let tag = "DIV";
    let css_classes;
    if (arg) {
      /* Extract tag and css_classes from arg */
      const arg_parts = arg.split(".");
      tag = arg_parts.shift();
      css_classes = arg_parts;
    }
    const web_component = tag !== tag.toUpperCase();

    let element;
    if (web_component) {
      element = new (this.get(tag))(updates, ...children);
    } else {
      element = document.createElement(tag);
    }

    /* Add css classes */
    if (css_classes && css_classes.length > 0) {
      /* NOTE Condition avoids adding empty class attr */
      element.classList.add(...css_classes);
    }

    if (web_component) {
      element.update(updates);
    } else {
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined) continue;
        if (key.startsWith("_")) {
          element[key] = value;
        } else if (key in element) {
          element[key] = value;
        } else if (key in element.style) {
          element.style[key] = value;
        } else if (key.startsWith(ATTR)) {
          const attr_key = camel_to_kebab(key.slice(ATTR.length));
          if (value === true) {
            element.setAttribute(attr_key, "");
          } else {
            element.setAttribute(attr_key, value);
          }
        } else if (key.startsWith(CSS_CLASS)) {
          const css_class = camel_to_kebab(key.slice(CSS_CLASS.length));
          element.classList[value ? "add" : "remove"](css_class);
        } else if (key.startsWith(ON)) {
          element.addEventListener(key.slice(ON.length), value);
        } else if (key === "text") {
          element.textContent = value;
        } else if (key === "parent") {
          if (value && element.parentElement !== value) {
            value.append(element);
          }
        } else {
          throw new Error(`Invalid key: ${key}`);
        }
      }
    }

    for (const child of children) {
      if (child === undefined) {
        continue;
      }
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
      if (Array.isArray(child)) {
        element.append(...child);
        continue;
      }

      element.append(child);
    }
    return element;
  };

  /* Returns non-autonomous web component class defined on-demand. */
  get = (tag) => {
    let cls = this.registry.get(tag);
    if (cls) {
      return cls;
    }
    if (tag.includes("-") || tag !== tag.toLowerCase()) {
      throw new Error(`No component registered with tag: ${tag}`);
    }
    /* Create and register non-autonomous web component */
    const native = document.createElement(tag).constructor;
    if (native === HTMLUnknownElement) {
      throw new Error(`Invalid tag: ${tag}`);
    }
    const factories = this.factories.get(tag);
    return this.author(tag, native, ...factories);
  };

  /* Base factory for all web components. */
  #base = (parent) => {
    /* Base factory that 'component' relies on */
    const cls = class ReactiveBase extends parent {
      #set_connected;
      constructor(...args) {
        super(...args);
        /* Identify as web component. */
        this.setAttribute("web-component", "");
        this.#set_connected = this.reactive.protected.add("connected");
        /* Show state as data attribute */

        this.effects.add((data) => {
          const updates = {};
          for (const [key, { current, previous }] of Object.entries(data)) {
            if (key && key.startsWith($)) {
              updates[key.slice($.length)] = current;
            } else {
              this.attribute[`state-${key}`] = current;
            }
          }
          this.update(updates);
        });
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
          target.classList[value ? "add" : "remove"](css_class);
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

      add_event_handler = (type, handler, return_handler = false) => {
        this.addEventListener(type, handler);
        if (return_handler) {
          return handler;
        }
        return this;
      };

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

      /* Removes all children. Chainable. */
      clear = () => {
        while (this.firstChild) {
          this.firstChild.remove();
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
          .forEach(
            ([key, value]) => (this.css[key.slice(CSS_CLASS.length)] = value)
          );

        /* CSS vars */
        Object.entries(updates)
          .filter(([key, value]) => key.startsWith(CSS_VAR))
          .forEach(
            ([key, value]) => (this.__[key.slice(CSS_VAR.length)] = value)
          );

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

component.factories.add(shadow, (tag) => {
  const element = document.createElement(tag);
  try {
    element.attachShadow({ mode: "open" });
    return true;
  } catch {
    return false;
  }
});

component.factories.add(text, (tag) => {
  const element = document.createElement(tag);
  return "textContent" in element;
});
component.factories.add(chain);
component.factories.add(children);

/*
EXAMPLES

const Component = component.author('x-stuff', HTMLElement)
*/
