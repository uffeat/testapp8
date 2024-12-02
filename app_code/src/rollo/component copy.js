import { Reactive } from "rollo/reactive";
import { shadow } from "@/rollo/factories/shadow";
import { text } from "@/rollo/factories/text";
import { chain } from "@/rollo/factories/chain";
import { children } from "@/rollo/factories/children";

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

/* Adds one or more css classes.  
Bind to element with call or bind.
args can be:
- Individual css class names
- String with multiple css class names separated by '.'
- Arrays of css class names
undefined handlers are ignored to support iife's. 
Chainable. */
function add_css(...args) {
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
}

/* Adds one or more event handlers from object. 
Bind to event target with call or bind.
Keys should be prefixed with 'on_'.
undefined handlers are ignored to support iife's.
Chainable.
Example: 
my_component.add_event_handlers({on_click: () => console.log('Clicked!')})
 */
function add_handlers(updates) {
  if (updates) {
    Object.entries(updates)
      .filter(([key, value]) => value !== undefined && key.startsWith(ON))
      .forEach(([key, value]) =>
        this.addEventListener(key.slice(ON.length), value)
      );
  }
  return this;
}

/* Calls one or more hooks. 
Bind to element with call or bind.
A hook is a function that is called bound to an element.
Any hook return values are appended to the element.
Useful during component contruction to:
- Add effects
- Add handlers, potentially conditionally
- Conditionally add one or more children
undefined hooks are ignored to support iife's. 
Chainable. */
function call_hooks(...hooks) {
  for (const hook of hooks) {
    if (hook === undefined) {
      continue;
    }
    if (typeof hook === "function") {
      const result = hook.call(this);
      if (result === undefined) {
        continue;
      }
      if (Array.isArray(result)) {
        this.append(...result);
      } else {
        this.append(result);
      }
      continue;
    }
    if (Array.isArray(hook)) {
      this.append(...hook);
      continue;
    }
    this.append(hook);
  }
  return this;
}

/* Updates one or more element attributes from object. 
Bind to element with call or bind.
Items with undefined values are ignored to support iife's.
Items with false values removes the attribute.
Items with true values add no-value attribute. 
Chainable. */
function update_attributes(attributes) {
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
}

/* Updates one or more css classes from object. 
Bind to element with call or bind.
Items with undefined values are ignored to support iife's.
Items with false values removes the css class.
Items with true values adds the css class. 
Camel-case keys are converted to kebab. 
Chainable. */
function update_css(css) {
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
}

/* Updates one or more props from object. 
Bind to element with call or bind.
Keys with shorthand prefixed are ignored.
Items with undefined values are ignored to support iife's.
Items with '_'-prefixed keys are allowed.
Items with keys that match a style key are added to the style object.
Items with other invalid keys throws an error.
Chainable. */
function update_properties(updates) {
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
}

/* Utility for authoring web components and instantiating elements. */
export const Component = new (class {
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

  /* Creates an returns element from object. 
  Supports rich in-line configuration, incl. hooks. */
  create_from_object = ({
    attributes,
    css,
    hooks,
    tag = "div",
    ...updates
  } = {}) => {
    hooks = hooks || [];
    return this.create(tag, { attributes, css, ...updates }, ...hooks);
  };

  /* Creates and returns a native element. 
  Supports rich in-line configuration, incl. hooks. */
  create_native = (
    arg,
    { attributes, css, parent, text, ...updates } = {},
    ...hooks
  ) => {
    const [tag, ...css_classes] = arg.split(".");
    const element = document.createElement(tag);
    add_css.call(element, css_classes);
    update_css.call(element, css);

    if (parent && element.parentElement !== parent) {
      parent.append(element);
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    update_properties.call(element, updates);
    update_attributes.call(element, attributes);
    add_handlers.call(element, updates);
    call_hooks.call(element, ...hooks);
    return element;
  };

  /* Creates an element. 
  Supports:
  - Rich in-line configuration, incl. hooks.
  - Construction from objects.
  - On-demand authoring of non-autonomous web component. */
  create = (arg, { attributes, css, ...updates } = {}, ...hooks) => {
    if (typeof arg !== "string") {
      return this.create_from_object(arg);
    }
    const [tag, ...css_classes] = arg.split(".");
    if (tag === tag.toUpperCase()) {
      return this.create_native(arg, { attributes, css, ...updates }, ...hooks);
    }
    const element = new (this.get(tag))(updates, ...hooks);
    element.add_css(css_classes);
    element.update({ attributes, css, ...updates });
    element.call(...hooks);
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
    const cls = class Base extends parent {
      #set_connected;
      constructor(...args) {
        super(...args);
        /* Identify as web component. */
        this.setAttribute("web-component", "");
        this.#set_connected = this.reactive.protected.add("connected");
        /* Show state as data attribute */
        this.effects.add((data) => {
          for (const [key, { current, previous }] of Object.entries(data)) {
            if (
              current === null ||
              ["boolean", "number", "string"].includes(typeof current)
            ) {
              this.attribute[`state-${key}`] = current;
            }
          }
        });
        /* Set up automatic prop updates from $-prefixed state */
        this.effects.add((data) => {
          const updates = {};
          for (const [key, { current, previous }] of Object.entries(data)) {
            if (key && key.startsWith($)) {
              updates[key.slice($.length)] = current;
            }
          }
          this.update_properties(updates);
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
          return target.classList.contains(camel_to_kebab(css_class));
        },
        set(target, css_class, value) {
          if (typeof value === "function") {
            value = value.call(target);
          }
          if (value === undefined) return true;
          target.classList[value ? "add" : "remove"](camel_to_kebab(css_class));
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

      /* Exposes reactive instance for full access to Reactive features. */
      get reactive() {
        return this.#reactive;
      }
      #reactive = Reactive.create(null, { owner: this });

      add_css = (...args) => {
        return add_css.call(this, ...args);
      };

      add_event_handler = (
        type,
        handler,
        { return_handler = false, run = false } = {}
      ) => {
        this.addEventListener(type, handler);
        if (run) {
          handler({});
        }
        if (return_handler) {
          return handler;
        }
        return this;
      };

      add_handlers = (updates) => {
        return add_handlers.call(this, updates);
      };

      /* */
      call = (...hooks) => {
        return call_hooks.call(this, ...hooks);
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
      find = (...selectors) => {
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
      update = ({ attributes, css, ...updates } = {}) => {
        /* Props */
        this.update_properties(updates);
        /* Attributes */
        this.update_attributes(attributes);
        /* CSS classes */
        this.update_css(css);
        /* CSS vars */
        Object.entries(updates)
          .filter(([key, value]) => key.startsWith(CSS_VAR))
          .forEach(
            ([key, value]) => (this.__[key.slice(CSS_VAR.length)] = value)
          );
        /* Handlers */
        this.add_handlers(updates);
        /* Reactive state */
        const state = Object.fromEntries(
          Object.entries(updates)
            .filter(([key, value]) => key.startsWith($))
            .map(([key, value]) => [key.slice(1), value])
        );
        this.reactive.update(state);

        return this;
      };

      update_css = (updates) => {
        return update_css.call(this, updates);
      };

      update_attributes = (updates) => {
        return update_attributes.call(this, updates);
      };

      update_properties = (updates) => {
        return update_properties.call(this, updates);
      };
    };
    return cls;
  };
})();

/* Short-hand */
export const create = Component.create;

/*
Component.factories.add(shadow, (tag) => {
  const element = document.createElement(tag);
  try {
    element.attachShadow({ mode: "open" });
    return true;
  } catch {
    return false;
  }
});
*/

Component.factories.add(text, (tag) => {
  const element = document.createElement(tag);
  return "textContent" in element;
});

/*
Component.factories.add(chain);
*/


/*
Component.factories.add(children);
*/

/*
EXAMPLES

const Component = Component.author('x-stuff', HTMLElement)
*/
