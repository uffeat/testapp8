import {
  attribute,
  chain,
  connected,
  css_classes,
  css_var,
  descendants,
  events,
  hooks,
  item_to_attribute,
  item_to_native,
  items,
  items_update,
  parent,
  properties,
  styles,
  tags,
  text,
  uid,
} from "rollo/factories/__factories__";
import { assign } from "rollo/utils/assign";

/* Utility for authoring web components and instantiating elements. */
export const Component = new (class Component {
  /* Returns registry controller. */
  get registry() {
    return this.#registry;
  }
  #registry = new (class Registry {
    #registry = {};
    /* Registers and returns class. */
    add = (tag, cls) => {
      if (tag.includes("-")) {
        customElements.define(tag, cls);
        import.meta.env.DEV &&
          console.info(
            `Registered autonomous web component with tag '${tag}'.`
          );
      } else {
        customElements.define(`native-${tag}`, cls, {
          extends: tag,
        });
        import.meta.env.DEV &&
          console.info(
            `Registered non-autonomous web component extended from '${tag}'.`
          );
      }
      this.#registry[tag] = cls;
      return cls;
    };
    /* Returns registered class. */
    get = (tag) => {
      return this.#registry[tag];
    };
  })();

  /* Returns controller for managing factories to be used for on-demand component 
  authoring. */
  get factories() {
    return this.#factories;
  }
  #factories = new (class Factories {
    #registry = [];
    /* Registers conditional web component class factory */
    add = (factory, condition) => {
      this.#registry.push([factory, condition]);
    };
    /* Check for missing factories. For use inside factories. */
    check = (required, factories) => {
      const missing = new Set(required).difference(new Set(factories));
      if (missing.size > 0) {
        const names = Array.from(missing).map((factory) => factory.name);
        throw new Error(`Missing factories: ${names}`);
      }
    };
    /* Returns factories relevant for a given tag */
    get = (tag) => {
      return this.#registry
        .filter(([factory, condition]) => !condition || condition(tag))
        .map(([factory, condition]) => factory);
    };
  })();

  get tools() {
    return this.#tools;
  }
  #tools = new (class Tools {
    create_observed_attributes = (parent, ...observedAttributes) => {
      return Array.from(
        new Set([...observedAttributes, ...(parent.observedAttributes || [])])
      );
    };
  })();

  /* Builds, registers and returns web component from native base and factories. */
  author = (tag, base, config, ...factories) => {
    const _factories = [...factories];
    let cls = factories.shift()(base, config, ..._factories);
    const names = [cls.name];
    const chain = [base, cls];
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

    /* TODO
    - Refactor to align with 'type'
    */

    assign(
      cls.prototype,
      class Meta {
        static __chain__ = Object.freeze(chain.reverse());
        static __config__ = Object.freeze(config || {});
        static __factories__ = Object.freeze(factories.reverse());
        static tag = tag;
        get __base__() {
          return base
        }
        get __chain__() {
          return Meta.__chain__;
        }
        get __config__() {
          return Meta.__config__;
        }
        get __factories__() {
          return Meta.__factories__;
        }
        get tag() {
          return Meta.tag;
        }
      }.prototype
    );

    return this.registry.add(tag, cls);
  };

  /* Creates an returns element from object. */
  create_from_object = ({ hooks: [], tag = "div", ...updates } = {}) => {
    return this.create(tag, updates, ...hooks);
  };

  /* Returns instance of web component. 
  Supports:
  - Rich in-line configuration, incl. children and hooks.
  - Construction from objects.
  - On-demand authoring of non-autonomous web components. */
  create = (arg, { config = {}, parent, ...updates } = {}, ...hooks) => {
    if (typeof arg !== "string") {
      /* arg is an object */
      return this.create_from_object(arg);
    }
    const [tag, ...css_classes] = arg.split(".");
    let element = new (this.get(tag))();
    /* Call the 'constructed_callback' lifecycle method */
    if (element.constructed_callback) {
      const result = element.constructed_callback(config);
      /* Allow truthy result to replace element */
      if (result) {
        element = result;
      }
      /* Prevent 'constructed_callback' from being used onwards */
      element.constructed_callback = undefined;
    }
    /* Add CSS classes */
    if (css_classes.length > 0) {
      element.classList.add(...css_classes);
    }
    /* Identify non-autonomous as web component */
    if (!element.tagName.includes("-")) {
      element.setAttribute("web-component", "");
    }
    /* Call the 'update' standard method */
    element.update && element.update(updates);
    /* Append children from hooks */
    element.append &&
      element.append(
        ...hooks.filter(
          (v) =>
            v instanceof HTMLElement || ["number", "string"].includes(typeof v)
        )
      );
    /* Call the 'call' standard method */
    element.call && element.call(...hooks);
    if (element.isConnected) {
      throw new Error(
        `Element should not be connected to the live DOM at this point.`
      );
    }
    /* Call the 'created_callback' lifecycle method */
    if (element.created_callback) {
      element.created_callback();
      /* Prevent 'created_callback' from being used onwards */
      element.created_callback = undefined;
    }
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
    const cls = this.registry.get(tag);
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
Component.factories.add(chain);
Component.factories.add(css_classes);
Component.factories.add(css_var);
Component.factories.add(connected);
Component.factories.add(descendants);
Component.factories.add(events);
Component.factories.add(hooks);
Component.factories.add(item_to_attribute);
Component.factories.add(item_to_native);
Component.factories.add(items);


Component.factories.add(items_update);


Component.factories.add(parent);
Component.factories.add(properties);
Component.factories.add(styles);
Component.factories.add(tags);
Component.factories.add(text, (tag) => {
  const element = document.createElement(tag);
  return "textContent" in element;
});
Component.factories.add(uid);
