/*  */
class Reactive {
  static create = (state, { name, owner } = {}) => {
    return new Reactive(state, { name, owner });
  };
  /* Helper for conditionally calling effect function. */
  static #call_effect = (effect, condition, ...args) => {
    if (!condition || condition(...args)) {
      effect(...args);
    }
  };
  #current = {};
  #effect_registry = new Map();
  #effect_controller;
  #name;
  #owner;
  #previous = {};
  #protected;

  constructor(state, { name, owner } = {}) {
    this.#name = name;
    this.#owner = owner;
    if (state) {
      this.#update_stores(state);
    }

    const reactive = this;

    this.#protected = new (class Protected {
      #registry = {};

      add = (key, value) => {
        const set = (value) => {
          if (!reactive.#is_equal(value, reactive.#current[key])) {
            reactive.#update_stores({ [key]: value });
            reactive.#notify(reactive.#create_effect_data(key), this);
          }
        };
        this.#registry[key] = set;
        if (value !== undefined) {
          set(value);
        }
        return set;
      };

      clear = () => {
        this.#registry[key] = {};
      };

      has = (key) => {
        return key in this.#registry;
      };
    })();

    /* Storage util for, potentially conditional, effect functions. */
    this.#effect_controller = new (class EffectController {
      /* Returns number of registered effecs */
      get size() {
        return reactive.#effect_registry.size;
      }

      /* Adds and returns effect.
      NOTE Effects are stored as keys with condition as value. */
      add = (effect, condition) => {
        condition = this.#interpret_condition(condition);
        /* Register effect */
        reactive.#effect_registry.set(effect, condition);
        /* Call effect by passing in arg based on the full underlying data and 
        using the same stucture as when the effect is called reactively */
        Reactive.#call_effect(
          effect,
          condition,
          reactive.#create_effect_data(...Object.keys(reactive.#current)),
          reactive
        );
        /* Return effect, so that effects added with function expressions
        can be removed later */
        return effect;
      };

      /* Removes all effects. Use with caution. Chainable with respect to reactive. */
      clear = () => {
        this.reactive.#effect_registry = new Map();
        return reactive;
      };

      /* Tests, if effect is registered. */
      has = (effect) => {
        return reactive.#effect_registry.has(effect);
      };

      /* Removes effect. Chainable with respect to reactive. */
      remove = (effect) => {
        reactive.#effect_registry.delete(effect);
        return reactive;
      };

      /* Returns condition, potentially created from short-hand. */
      #interpret_condition = (condition) => {
        if (condition === undefined) return;
        if (typeof condition === "function") return condition;
        if (typeof condition === "string") {
          /* Create condition function from string short-hand:
          data must contain a key corresponding to the string short-hand. */
          const key = condition;
          condition = (data) => key in data;
        } else if (Array.isArray(condition)) {
          /* Create condition function from array short-hand:
          data must contain a key that is present in the array short-hand. */
          const keys = condition;
          condition = (data) => {
            for (const key of keys) {
              if (key in data) {
                return true;
              }
            }
            return false;
          };
        } else {
          /* By usage convention, assume single item plain object of the form: 
          {<required key>: <required current value>} */
          const key = Object.keys(condition)[0];
          const value = Object.values(condition)[0];
          condition = (data) => key in data && data[key].current === value;
        }
        return condition;
      };
    })();
  }

  /* Returns controller for managing effects. */
  get effects() {
    return this.#effect_controller;
  }

  /* Returns name, primarily for optional soft identification. */
  get name() {
    return this.#name;
  }

  /* Returns owner.
  NOTE The owner feature is provided for potential use in extension of or
  compositions with Reactive. */
  get owner() {
    return this.#owner;
  }

  /* Returns object,from which individual state items can be retrieved and set 
  reactively. */
  get $() {
    return this.#$;
  }
  #$ = new Proxy(this, {
    get: (target, key) => {
      return this.#current[key];
    },
    set: (target, key, value) => {
      /* Handle function value */
      if (typeof value === "function") {
        value = value.call(this);
      }
      this.update({ [key]: value });
      return true;
    },
  });

  /* Clears state data without publication. Use with caution. Chainable. */
  clear = () => {
    this.#previous = this.#current;
    this.#current = {};
    this.protected.clear();
    return this;
  };

  /* Returns a shallowly frozen shallow copy of underlying state data as it was 
  before the most recent change. */
  get previous() {
    return Object.freeze({ ...this.#previous });
  }

  /* Returns a shallowly frozen shallow copy of underlying state data. */
  get current() {
    return Object.freeze({ ...this.#current });
  }

  get protected() {
    return this.#protected;
  }

  /* Updates state from data (object). Chainable.
  Convenient for updating multiple state items in one go.
  Can reduce redundant effect calls. */
  update = (data) => {
    /* Detect changes */
    const changes = this.#get_changes(data);
    /* Abort if no change */
    if (!changes) return;
    /* Update data stores */
    this.#update_stores(changes);
    /* Call effects */
    this.#notify(this.#create_effect_data(...Object.keys(changes)), this);
    return this;
  };

  /* Creates and returns object of the form
  { <key>: { current: <current value>, previous: <previous value> }, <key>: ... }
  to be passed into effects/conditions. */
  #create_effect_data = (...keys) => {
    const data = {};
    for (const key of keys) {
      data[key] = {
        current: this.#current[key],
        previous: this.#previous[key],
      };
    }
    Object.freeze(data);
    return data;
  };

  /* Compares current with 'data'. Returns null, if all items in 'data' 
  are present in current; otherwise, an object with 'data' items that are 
  different from current is returned. */
  #get_changes = (data) => {
    const changes = {};
    for (const [key, value] of Object.entries(data)) {
      if (this.protected.has(key)) {
        throw new Error(`'${key}' is protected.`);
      }

      if (
        !(key in this.#current) ||
        !this.#is_equal(value, this.#current[key])
      ) {
        changes[key] = value;
      }
    }
    return Object.keys(changes).length === 0 ? null : changes;
  };

  /* Returns Boolean result of simple equality comparison.
  NOTE Default function; may be changed by constructor arg. */
  #is_equal = (value_1, value_2) => value_1 === value_2;

  /* Publishes to effects subject to any conditions. Chainable */
  #notify = (...args) => {
    for (const [effect, condition] of this.#effect_registry) {
      Reactive.#call_effect(effect, condition, ...args);
    }
    return this;
  };

  /* Updates stores with 'data'. Chainable. */
  #update_stores = (data) => {
    this.#previous = this.#current;
    for (const [key, value] of Object.entries(data)) {
      this.#current[key] = value;
    }
    return this;
  };
}

/* Uility for composing and registering non-autonomous web components on demand. */
const components = new (class Components {
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
  create = (arg = null, { parent, ...updates } = {}, ...children) => {
    let tag = "div";
    let css_classes;
    if (arg) {
      /* Extract tag and css_classes from arg */
      const arg_parts = arg.split(".");
      tag = arg_parts.shift();
      css_classes = arg_parts;
    }
    const element = new (this.get(tag))();
    /* Add css classes */
    if (css_classes && css_classes.length > 0) {
      /* NOTE Condition avoids adding empty class attr */
      element.classList.add(...css_classes);
    }
    if (parent) {
      element.parent = parent;
    }
    element.update(updates);
    element.append(...children);
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
    /* Base factory that 'Components' relies on */
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

      /* Returns controller for managing effects. */
      get effects() {
        return this.#reactive.effects;
      }

      get parent() {
        return this.parentElement;
      }

      set parent(parent) {
        if (parent) {
          if (this.parentElement !== parent) {
            parent.append(this);
          }
        } else {
          this.remove();
        }
      }

      /* Exposes reactive instance for full access */
      get reactive() {
        return this.#reactive;
      }
      #reactive = Reactive.create(null, { owner: this });

      /* Appends children and handles hooks. Chainable. */
      append = (...children) => {
        for (const child of children) {
          if (child === undefined) {
            continue;
          }
          if (typeof child === "function") {
            const result = child.call(this);
            if (result === undefined) {
              continue;
            }
            if (Array.isArray(result)) {
              super.append(...result);
            } else {
              super.append(result);
            }
            continue;
          }
          super.append(child);
        }
        return this
      };

      /* Updates props, attributes and state. Chainable. */
      update = (updates) => {
        const $ = "$";
        const ATTR = "attr_";

        // TODO handlers

        /* Handle props */
        Object.entries(updates)
          .filter(([key, value]) => !key.startsWith($) && !key.startsWith(ATTR))
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

        /* Handle attributes */
        Object.entries(updates)
          .filter(([key, value]) => !key.startsWith($) && key.startsWith(ATTR))
          .forEach(
            ([key, value]) => (this.attribute[key.slice(ATTR.length)] = value)
          );

        /* Handle reactive state */
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

/* Factories */

/* Component */
components.factories.add(
  (tag) => true,
  (parent) => {
    function camel_to_kebab(camel) {
      return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }

    /* General factory for all components */
    const cls = class Component extends parent {
      constructor(...args) {
        super(...args);
      }

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
          if (value) {
            target.classList.add(css_class);
          } else {
            target.classList.remove(css_class);
          }
          return true;
        },
      });

      /* Getter/setter interface component-scoped css vars. */
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
          if (value) {
            target.style.setProperty(`--${key}`, value);
          } else {
            target.style.removeProperty(`--${key}`);
          }
          return true;
        },
      });

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
    };
    return cls;
  }
);

/* Shadow */
components.factories.add(
  (tag) => {
    const element = document.createElement(tag);
    try {
      element.attachShadow({ mode: "open" });
      return true;
    } catch {
      return false;
    }
  },
  (parent) => {
    /* Factory for components that support shadow dom */
    const cls = class Shadow extends parent {
      #set_has_children;
      #set_has_content;
      constructor(...args) {
        super(...args);
        /* Init shadow-dom-enabled protected state */
        this.#set_has_children = this.reactive.protected.add(
          "has_children",
          false
        );
        this.#set_has_content = this.reactive.protected.add(
          "has_content",
          false
        );

        this.attachShadow({ mode: "open" });
        const slot = document.createElement("slot");
        this.shadowRoot.append(slot);

        slot.addEventListener("slotchange", (event) => {
          // Update protected state
          this.#set_has_children(this.children.length > 0);
          this.#set_has_content(this.childNodes.length > 0);
        });
      }
    };
    return cls;
  }
);

/* Text */
components.factories.add(
  (tag) => {
    const element = document.createElement(tag);
    return "textContent" in element;
  },
  (parent) => {
    /* Factory for components with 'textContent' prop */
    const cls = class Text extends parent {
      constructor(...args) {
        super(...args);
      }

      get text() {
        return this.textContent;
      }
      set text(text) {
        this.textContent = text;
      }
    };
    return cls;
  }
);

/* Chain */
components.factories.add(
  (tag) => true,
  (parent) => {
    /* Factory with prototype chain utils */
    const cls = class Chain extends parent {
      constructor(...args) {
        super(...args);
      }
      /* Returns prototype chain up until HTMLElement as a frozen array. */
      get chain() {
        /* NOTE Should give the same result as '__chain__' (created in Components.author),
        but is provided as prop that generates the chain at each invocation to ensure that 
        the returned value always corresponds to the current chain. */
        const chain = [];
        let proto = Object.getPrototypeOf(this).constructor;
        while (proto !== HTMLElement) {
          chain.push(proto);
          proto = Object.getPrototypeOf(proto);
        }
        Object.freeze(chain);
        return chain;
      }
    };
    return cls;
  }
);

/* ChildObserver */
components.factories.add(
  (tag) => true,
  (parent) => {
    /* Factory with MutationsObserver  */
    const cls = class ChildObserver extends parent {
      #child_observer;
      constructor(...args) {
        super(...args);
        const component = this;
        this.#child_observer = new (class ChildObserver {
          #handler = (mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === "childList") {
                [...mutation.addedNodes]
                  .filter((node) => node instanceof HTMLElement)
                  .forEach((node) => {
                    node.send("added_to_parent", {
                      detail: { new_parent: component },
                    });
                    component.send("child_added", {
                      detail: { added_child: node },
                    });
                  });
                [...mutation.removedNodes]
                  .filter((node) => node instanceof HTMLElement)
                  .forEach((node) => {
                    node.send("removed_from_parent", {
                      detail: { previous_parent: component },
                    });
                    component.send("child_removed", {
                      detail: { removed_child: node },
                    });
                  });
              }
            });
          };
          #mutation_observer = new MutationObserver(this.#handler);
          #observes = false;
          #use = false;

          /* Activates child observer until component disconnect */
          start = () => {
            if (this.#observes) {
              return;
            }
            this.#mutation_observer.observe(component, {
              childList: true,
              subtree: false,
            });
            this.#observes = true;
          };

          /* Dectivates child observer */
          stop = () => {
            if (!this.#observes) {
              return;
            }
            this.#mutation_observer.disconnect();
            this.#observes = false;
          };

          get use() {
            return this.#use;
          }

          /* Contols useage of child observer.
          falsy: Stops observer.
          true: Runs observer and keeps it running.
          1: Runs observer, whenever component is connected. */
          set use(use) {
            if (!use) {
              this.stop();
            } else if (use === true) {
              this.start();
            } else if (use === 1) {
              if (component.isConnected) {
                this.start();
              }
            } else {
              throw new Error(`Invalid use: ${use}`);
            }
            this.#use = use;
            component.attribute.dataChildObserver = use;
          }
        })();
      }

      get child_observer() {
        return this.#child_observer;
      }

      connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        if (this.child_observer.use) {
          this.child_observer.start();
        }
      }

      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback();
        if (this.child_observer.use !== true) {
          this.child_observer.stop();
        }
      }
    };
    return cls;
  }
);

export const create = components.create;

/* */
export function decorate(constructor, ...decorators) {
  for (const decorator of decorators) {
    constructor = decorator(constructor);
  }
  return constructor;
}

/* Use with small source classes. */
export function compose(...sources) {
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
}

/* Use with small source classes. */
export function mixin(source, ...args) {
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
}
