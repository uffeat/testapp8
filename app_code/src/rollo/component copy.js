import {
  attribute,
  base,
  connected,
  css_classes,
  css_var,
  descendants,
  hooks,
  observer,
  parent,
  properties,
  events,
  shadow,
  text,
  uid,
} from "rollo/factories/__factories__";

//import { sheet } from "rollo/factories/sheet";

import { can_have_shadow } from "rollo/utils/can_have_shadow";

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
  author = (tag, native, config, ...factories) => {
    const _factories = [...factories];
    let cls = factories.shift()(native, config, ..._factories);
    const names = [cls.name];
    const chain = [native, cls];
    for (const factory of factories) {
      cls = factory(cls, config, ..._factories);
      if (names.includes(cls.name)) {
        console.warn(
          `Factory class names should be unique for better traceability. Got duplicate: ${cls.name}`
        );
      }
      names.push(cls.name);
      chain.push(cls);
    }

    /* Create __chain__ as instance prop that returns a frozen array of prototypes in mro.
    __chain__ represents the prototype chain as created here. */
    const __chain__ = Object.freeze(chain.reverse());

    Object.defineProperty(cls.prototype, "__chain__", {
      configurable: true,
      enumerable: false,
      get: function () {
        return __chain__;
      },
    });

    const __config__ = Object.freeze(config || {});
    Object.defineProperty(cls.prototype, "__config__", {
      configurable: true,
      enumerable: false,
      get: function () {
        return __config__;
      },
    });
    return this.registry.add(tag, cls);
  };

  /* Creates an returns element from object. */
  create_from_object = ({ args: [], tag = "div", ...updates } = {}) => {
    return this.create(tag, updates, ...args);
  };

  /* Creates an element. 
  Supports:
  - Rich in-line configuration, incl. children and hooks.
  - Construction from objects.
  - On-demand authoring of non-autonomous web component. */
  create = (arg, { parent, ...updates } = {}, ...args) => {
    if (typeof arg !== "string") {
      /* arg is an object */
      return this.create_from_object(arg);
    }
    const [tag, ...css_classes] = arg.split(".");
    const element = new (this.get(tag))({ parent, ...updates }, ...args);
    if (css_classes.length > 0) {
      element.classList.add(...css_classes);
    }
    element.update && element.update(updates);
    if (element.isConnected) {
      throw new Error(
        `Element should not be connected to the live dom at this point.`
      );
    }
    element.created_callback && element.created_callback(...args);
    /* Handle parent separately to ensure that any connectedCallbacks are 
    always called AFTER any created_callbacks */
    if (parent) {
      if (typeof parent === "string") {
        const selector = parent;
        parent = document.querySelector(selector);
        if (!parent) {
          throw new Error(`Could not find parent from selector: ${selector}`);
        }
      } else {
        if (!(parent instanceof HTMLElement)) {
          throw new Error(`Invalid parent: ${parent}`);
        }
      }
      parent.append(element);
    }
    return element;
  };

  /* Returns web component class defined on-demand, if native. */
  get = (tag) => {
    let cls = this.registry.get(tag);
    if (cls) {
      return cls;
    }
    if (tag.includes("-")) {
      throw new Error(`No component registered with tag: ${tag}`);
    }
    /* Create and register non-autonomous web component */
    const native = document.createElement(tag).constructor;
    if (native === HTMLUnknownElement) {
      throw new Error(`Invalid tag: ${tag}`);
    }
    const factories = this.factories.get(tag);
    return this.author(tag, native, {}, ...factories);
  };
})();

/* Short-hand */
export const create = Component.create;

/* Add factories */
Component.factories.add(attribute);
Component.factories.add(base);
Component.factories.add(css_classes);
Component.factories.add(css_var);
Component.factories.add(connected);
Component.factories.add(descendants);
Component.factories.add(events);
Component.factories.add(hooks);
/* TODO
Consider not using observer as a standard factory. currently not used.  */
Component.factories.add(observer);
Component.factories.add(parent);
Component.factories.add(properties);
/* TODO
Consider not using shadow as a standard factory. currently not used.  */
Component.factories.add(shadow, can_have_shadow);
Component.factories.add(text, (tag) => {
  const element = document.createElement(tag);
  return "textContent" in element;
});
Component.factories.add(uid);

//Component.factories.add(sheet);
