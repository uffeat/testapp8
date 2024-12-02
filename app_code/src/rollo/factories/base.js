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



/* Base factory for all web components. */
export const base = (parent) => {
  /* Base factory that 'component' relies on */
  const cls = class Base extends parent {
    constructor(...args) {
      super(...args);
      /* Identify as web component. */
      this.setAttribute("web-component", "");
     
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.dispatchEvent(new Event("connected"));
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
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

    /* Getter/setter interface for component-scoped css vars. */
    get __() {
      return this.#__;
    }
    #__ = new Proxy(this, {
      get(target, key) {
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

    /*
    TODO
    Probably purge?
    */
    add_event_handler(
      type,
      handler,
      { return_handler = false, run = false } = {}
    ) {
      this.addEventListener(type, handler);
      if (run) {
        handler({});
      }
      if (return_handler) {
        return handler;
      }
      return this;
    };

    /* Removes all children. Chainable. */
    clear() {
      while (this.firstChild) {
        this.firstChild.remove();
      }
      return this;
    };

    /* Returns array of unique descendant elements that match ANY selectors. 
    Returns null, if no matches.
    A more versatile alternative to querySelectorAll with a return value 
    that array methods can be used directly on (unless null) */
    find(...selectors) {
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
    send(type, { detail, ...options } = {}) {
      this.dispatchEvent(new CustomEvent(type, { detail, ...options }));
      /* NOTE If detail is mutable, it's handy to get it back, 
      since handler may have mutated it. This enables two-way communication 
      between event target and handler. */
      return detail;
    };

    
  };
  return cls;
};