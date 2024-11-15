/* NOTE Use relative imports with suffix and without shortcuts to allow import 
from outside test code. */
import { Reactive } from "./reactive.js";

const registry = new (class {
  #components = {};

  add = (key, cls) => {
    if (this.get(key)) {
      throw new Error(`A component with key '${key}' already registered.`);
    }
    this.#components[key] = cls;
  };

  get = (key) => {
    return this.#components[key];
  };
})();

/* Util for authoring and instantiating web components derived from a common base
with reactive features. */
export const component = new (class {
  /* Creates, registers and returns web component derived from Base - and if relevant
  Shadow. Supports synthetic multiple-inheritance via factory functions. */
  author = ({ base = HTMLElement, config = {}, key }, ...factories) => {
    let cls;
    if (base === HTMLElement) {
      /* Handle autonomous */
      cls = create_class(
        base,
        config,
        base_factory,
        shadow_factory,
        ...factories
      );
      customElements.define(key, cls);
      registry.add(key, cls);
    } else if (typeof base === "string") {
      /* Handle non-autonomous */
      const tag = base;
      base = base_from_tag(tag);
      if (!base) {
        throw new Error(`Invalid tag: ${tag}`);
      }
      if (can_have_shadow(tag)) {
        factories = [base_factory, shadow_factory, ...factories];
      } else {
        factories = [base_factory, ...factories];
      }
      cls = create_class(base, config, ...factories);
      customElements.define(key || `native-${tag}`, cls, {
        extends: tag,
      });
      registry.add(key || tag, cls);
    } else {
      throw new Error(`Invalid base: ${base}`);
    }
    return cls;
  };

  /* Returns web component instance with rich in-line configuration options,
  incl. iife's and hooks.
  Inspired by React's createElement and hook concepts. */
  create = (arg, { compositions, mixins, ...props } = {}, ...args) => {
    /* Extract tag and css_classes from arg */
    const [tag, ...css_classes] = arg.split(".");
    const self = new (this.get(tag))(props, ...args);
    /* Apply any mixins */
    if (mixins) {
      mixins.forEach((mixin) => self.mixin(mixin, props, ...args));
    }
    /* Apply any compositions */
    if (compositions) {
      self.compose(...compositions);
    }
    /* Add css classes */
    if (css_classes.length > 0) {
      /* NOTE Condition avoids adding empty class attr */
      self.classList.add(...css_classes);
    }
    /* Set props */
    self.update(props);
    /* Parse args (children and hooks) */
    const deferred = [];
    const fragment = new (this.get("div"))();
    const hooks = [];
    for (const arg of args) {
      if (arg === undefined) {
        continue;
      }
      if (is_node(arg)) {
        fragment.append(arg);
        continue;
      }
      if (Array.isArray(arg)) {
        for (const node of arg) {
          if (!is_node(node)) {
            throw new Error(`Invalid node: ${node}`);
          }
          fragment.append(node);
        }
        continue;
      }
      if (typeof arg === "function") {
        hooks.push(arg);
        continue;
      }
      throw new Error(`Invalid arg: ${arg}`);
    }
    /* Call hooks */
    for (const hook of hooks) {
      const result = hook.call(self, fragment);
      if (typeof result === "function") {
        deferred.push(result);
      }
    }
    /* Append children */
    self.append(...fragment.childNodes);
    /* Run deferred */
    deferred.forEach((hook) => hook.call(self));

    return self;
  };

  /* Returns registered Component. Creates and registers non-autonomous components 
  on-demand, if key corresponds to a native tag. */
  get = (key) => {
    if (!registry.get(key) && !key.includes("-")) {
      return this.author({ base: key });
    }
    return registry.get(key);
  };
})();

function base_factory(parent, config, ...factories) {
  const NATIVE = "$";
  const ON = "on_";
  const REACTIVE = "$";
  const SHORTKEYS = Object.freeze({
    aria: "aria_",
    attr: "attr_",
    css_class: ".",
    css_var: "--",
    data: "data_",
  });

  return class Base extends parent {
    static __inits__ = [];

    /* Creates props from instantiated composition source classes.
    Can be seen as a more primitive alternative to adding
    compositions in factories with 'author'. Useful for adding compositions
    to component classes that have been registered.  
    NOTE 
    - May overwrite existing members without warning. 
    EXAMPLE
    component
      .author({ base: "button" })
      .compose(
        class tag {
          #owner;
          constructor(owner) {
            this.#owner = owner;
          }
          log = () => {
            console.log(this.#owner.tagName);
          };
        }
      );
    */
    static compose = (...sources) => {
      for (const source of sources) {
        if (!source.name) {
          throw new Error(
            `Composition class should be declared with a name or have a static 'name' prop.`
          );
        }
        Object.defineProperty(Base.prototype, source.name, {
          enumerable: false,
          configurable: true,
          get: function () {
            return this[`_${source.name}`];
          },
        });
        Base.__inits__.push(function () {
          this[`_${source.name}`] = new source(this);
        });
      }
    };

    /* Copies members from source classes onto prototype.
    Can be seen as a more primitive alternative to building component 
    classes using factories with 'author'. Useful for adding features to 
    component classes that have been registered. 
    NOTE 
    - Source classes should use an '__init__' method instead of 'constructor'.
      Such '__init__' methods are called (bound) after init of all factory-added 
      classes.
    - May overwrite members without warning.
    - Source classes have access to target prototypes's super via 'this.__super__',
      but only with respect to native members.
    - Private fields are not supported in source classes 
      (use the '_'-prefix convention instead).
    EXAMPLE
    component
      .author({ base: "button" })
      .mixin(
        class TextMixin {
          __init__() {
            this.textContent = "Default";
          }
          get textContent() {
            return this.__super__.textContent;
          }
          set textContent(text) {
            this.__super__.textContent = text.toUpperCase();
          }
        }
      );
    */
    static mixin = (...sources) => {
      for (const source of sources) {
        for (const [name, descriptor] of Object.entries(
          Object.getOwnPropertyDescriptors(source.prototype)
        )) {
          if (name === "__init__") {
            Base.__inits__.push(descriptor.value);
            continue;
          }
          Object.defineProperty(Base.prototype, name, descriptor);
        }
      }
      return Base;
    };

    #reactive = new Reactive({ owner: this });

    constructor(...args) {
      super(...args);
      /* Identify as web component. */
      this.setAttribute("web-component", "");

      this.__class__.__inits__.forEach((init) => init.call(this, ...args));

      /* Add effect to update component when state is updated with keys that
      follow certain (natively inspired) naming conventions. */
      this.effects.add((data) => {
        for (const [key, { current: value }] of Object.entries(data)) {
          if (typeof key !== "string") continue;
          if (key.startsWith(NATIVE)) {
            this.update({ [key.slice(NATIVE.length)]: value });
          } else {
            for (const shortkey of Object.values(SHORTKEYS)) {
              if (key.startsWith(shortkey)) {
                this.update({ [key]: value });
                break;
              }
            }
          }
        }
      });
    }

    connectedCallback() {
      this.$.connected = true;
      this.dispatchEvent(new Event("x-connected"));
    }

    disconnectedCallback() {
      this.$.connected = false;
      this.dispatchEvent(new Event("x-disconnected"));
    }

    get __class__() {
      return Base;
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

    /* Provides a prop-like interface to attrs. */
    get attr() {
      return this.#attr;
    }
    #attr = new Proxy(this, {
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

    /* Provides a prop-like interface to controlling css class. */
    get css_class() {
      return this.#css_class;
    }
    #css_class = new Proxy(this, {
      get(target, css_class) {
        return target.classList.contains(css_class)
      },
      set(target, css_class, value) {
        if (value) {
          target.classList.add(css_class)
        } else {
          target.classList.remove(css_class)
        }
        return true;
      },
    });

    /* Provides a prop-like interface to component-scoped css vars. */
    get css_var() {
      return this.#css_var;
    }
    #css_var = new Proxy(this, {
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
        if (value) {
          target.style.setProperty(`--${key}`, value);
        } else {
          target.style.removeProperty(`--${key}`);
        }
        return true;
      },
    });

    /* Returns controller for managing subscriptions. */
    get effects() {
      return this.#reactive.effects;
    }

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
      if (parent && this.parentElement !== parent) {
        parent.append(this);
      }
    }

    /* Returns an object, from which single state items can be retrieved 
    and set to trigger effects. */
    get $() {
      return this.#reactive.$;
    }

    get text() {
      return this.textContent;
    }

    set text(text) {
      this.textContent = text;
    }

    /* Registers and optionally invokes event handler. Chainable. */
    add_event_handler = (type, handler, run = false) => {
      if (run) {
        this.addEventListener(type, handler);
        this.dispatchEvent(
          new (class NonEvent extends Event {
            constructor() {
              super(type);
              this.non_event = true;
            }
          })(type)
        );
        this.removeEventListener(type, handler);
      }
      this.addEventListener(type, handler);
      return this;
    };

    /* Removes all child nodes. Chainable. */
    clear_content() {
      while (this.firstChild) {
        this.firstChild.remove();
      }
      return this;
    }

    /* Instance version of Base.compose. Chainable
    Use with small source classes. */
    compose = (...sources) => {
      for (const source of sources) {
        const composition = new source(this);
        if (!source.name) {
          throw new Error(
            `Composition class should be declared with a name or have a static 'name' prop.`
          );
        }
        Object.defineProperty(this, source.name, {
          enumerable: false,
          configurable: true,
          get: () => composition,
        });
      }
      return this;
    };

    /* Returns array of unique descendant elements that match ANY selectors. 
    A more versatile alternative to querySelectorAll with a return value 
    that array methods can be used directly on.
    - And I can avoid writing the clunky 'querySelectorAll' :-) */
    get_elements(...selectors) {
      return [
        ...new Set(
          selectors
            .map((selector) => [...this.querySelectorAll(selector)])
            .flat()
        ),
      ];
    }

    /* Returns a shallowly frozen shallow copy of underlying state data as it was before 
    the most recent change. */
    get previous_state() {
      return this.#reactive.previous;
    }

    /* Returns a shallowly frozen shallow copy of underlying state data. */
    get state() {
      return this.#reactive.state;
    }

    /* Instance version of Base.mixin. Chainable.
    Use with small source classes. */
    mixin = (source, ...args) => {
      for (const [name, descriptor] of Object.entries(
        Object.getOwnPropertyDescriptors(source.prototype)
      )) {
        if (name === "__init__") {
          descriptor.value.call(this, ...args);
          continue;
        }
        Object.defineProperty(this, name, descriptor);
      }

      return this;
    };

    /* Removes descendant elements, subject to selectors. Chainable. */
    remove_elements(...selectors) {
      this.get_elements(...selectors).forEach((element) => element.remove());
      return this;
    }

    /* Deregisters event handler. Chainable. */
    remove_event_handler = (type, handler) => {
      this.removeEventListener(type, handler);
      return this;
    };

    /* Dispatches custom event and returns detail. */
    send_event = (type, { detail, ...options } = {}) => {
      this.dispatchEvent(new CustomEvent(type, { detail, ...options }));
      /* NOTE If detail is mutable, it's handy to get it back, 
      since handler may have mutated it. This enables two-way communication 
      between event target and handler. */
      return detail;
    };

    /* Updates element and state. Supports 'shortkeys'. Chainable. */
    update = (props) => {
      const state = {};
      /* NOTE Conditional logic in order of expected use-prevalence */
      for (const [key, value] of Object.entries(props)) {
        /* Handle undefined value */
        if (value === undefined) {
          /* Ignoring undefined value is useful, e.g., when value is provided by an iife */
          continue;
        }
        // Handle standard prop
        if (key in this) {
          this[key] = value;
          continue;
        }
        /* Handle non-standard prop */
        if (key.startsWith("_")) {
          this[key] = value;
          continue;
        }
        // Handle style prop
        if (key in this.style) {
          this.style[key] = value;
          continue;
        }
        /* Handle css class shortkey */
        if (key.startsWith(SHORTKEYS.css_class)) {
          this.classList[!!value ? "add" : "remove"](
            key.slice(SHORTKEYS.css_class.length)
          );
          continue;
        }
        /* Handle attr shortkey */
        if (key.startsWith(SHORTKEYS.attr)) {
          this.attr[key.slice(SHORTKEYS.attr.length)] = value;
          continue;
        }
        /* Handle data attr shortkey */
        if (key.startsWith(SHORTKEYS.data)) {
          this.attr[`data-${key.slice(SHORTKEYS.data.length)}`] = value;
          continue;
        }
        /* Handle aria attr shortkey */
        if (key.startsWith(SHORTKEYS.aria)) {
          this.attr[`aria-${key.slice(SHORTKEYS.aria.length)}`] = value;
          continue;
        }
        /* Handle special event listener shortkey */
        if (key.startsWith(ON)) {
          this.on[key.slice(ON.length)] = value;
          continue;
        }
        /* Handle css var shortkey */
        if (key.startsWith(SHORTKEYS.css_var)) {
          this.css_var[key.slice(SHORTKEYS.css_var.length)] = value;
          continue;
        }
        /* Handle state */
        if (key.startsWith(REACTIVE)) {
          state[key.slice(REACTIVE.length)] = value;
          continue;
        }
        throw new Error(`Invalid prop: ${key}`);
      }
      if (Object.keys(state).length > 0) {
        this.#reactive.update(state);
      }
      return this;
    };
  };
}

function base_from_tag(tag) {
  const base = document.createElement(tag).constructor;
  if (base !== HTMLUnknownElement) {
    return base;
  }
}

function camel_to_kebab(camel) {
  if (typeof camel !== "string") {
    throw new Error(
      `Bad ingridient for making a kebab: ${camel}. Go get a camel!`
    );
  }
  return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function can_have_shadow(tag) {
  const element = document.createElement(tag);
  try {
    element.attachShadow();
    return true;
  } catch {
    return false;
  }
}

/* Creates class from base and factories (synthetic multiple inheritance). */
function create_class(base, config = {}, ...factories) {
  let cls = factories.shift()(base, config);
  for (const factory of factories) {
    const result = factory(cls, config, ...factories);
    if (result) {
      cls = result;
    }
  }
  Object.freeze(config);
  cls.__config__ = config;
  return cls;
}

function is_node(arg) {
  return (
    arg instanceof HTMLElement || ["number", "string"].includes(typeof arg)
  );
}

function shadow_factory(parent, config, ...factories) {
  return class Shadow extends parent {
    constructor(...args) {
      super(...args);
      /* Init shadow-dom-enabled state */
      this.$.has_children = false;
      this.$.has_content = false;

      this.attachShadow({ mode: "open" });
      const slot = document.createElement("slot");
      this.shadowRoot.append(slot);

      slot.addEventListener("slotchange", (event) => {
        this.send_event("slotchange");
        /* Update state */
        this.$.has_children = this.children.length > 0;
        this.$.has_content = this.childNodes.length > 0;
      });
    }
  };
}

/* Short-hands. */
export const create = component.create;
