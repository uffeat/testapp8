import { base } from "rollo/factories/base";
import { clear } from "rollo/factories/clear";
import { connected } from "rollo/factories/connected";
import { css_classes } from "rollo/factories/css_classes";
import { find } from "rollo/factories/find";
import { hooks } from "rollo/factories/hooks";
import { observer } from "rollo/factories/observer";
import { parent } from "rollo/factories/parent";
import { send } from "rollo/factories/send";
import { shadow } from "rollo/factories/shadow";
import { state } from "rollo/factories/state";
import { text } from "rollo/factories/text";
import { update } from "rollo/factories/update";

import { constants } from "rollo/constants";
import { can_have_shadow } from "rollo/utils/can_have_shadow";

const STATE_CSS_CLASS = `${constants.STATE}${constants.CSS_CLASS}`;

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
    const element = new (this.get(tag))(updates, ...hooks);
    if (css_classes.length > 0) {
      element.classList.add(...css_classes);
    }
    element.update({ attributes, css, ...updates });

    element.css_classes.add(
      ...hooks.filter(
        (hook) =>
          typeof hook === "string" &&
          (hook.startsWith(constants.CSS_CLASS) ||
            hook.startsWith(STATE_CSS_CLASS))
      )
    );

    element.call(
      ...hooks.filter((hook) => {
        if (
          typeof hook === "string" &&
          (hook.startsWith(constants.CSS_CLASS) ||
            hook.startsWith(STATE_CSS_CLASS))
        ) {
          return false;
        }
        return true;
      })
    );
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


/* Add factories; order matters */
Component.factories.add(base);
Component.factories.add(update);
Component.factories.add(state);
/* Add factories; order does not matter */
Component.factories.add(clear);
Component.factories.add(connected);
Component.factories.add(css_classes);
Component.factories.add(find);
Component.factories.add(hooks);
Component.factories.add(observer);
Component.factories.add(parent);
Component.factories.add(send);
Component.factories.add(shadow, can_have_shadow);
Component.factories.add(text, (tag) => {
  const element = document.createElement(tag);
  return "textContent" in element;
});

