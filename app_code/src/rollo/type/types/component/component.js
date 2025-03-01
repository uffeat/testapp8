// import { Component, component } from "@/rollo/type/types/component/component";
// const { Component, component } = await import("@/rollo/type/types/component/component");

import { type } from "@/rollo/type/type/type";
import { can_have_shadow } from "@/rollo/tools/can_have_shadow";
import { is_node } from "@/rollo/tools/is/is_node";

/* Component factories */
import { attribute } from "@/rollo/type/types/component/factories/attribute";
import { classes } from "@/rollo/type/types/component/factories/classes";
import { content } from "@/rollo/type/types/component/factories/content";
import { connected } from "@/rollo/type/types/component/factories/connected";
import { css_vars } from "@/rollo/type/types/component/factories/css_vars";
import { data } from "@/rollo/type/types/component/factories/data";
import { descendants } from "@/rollo/type/types/component/factories/descendants";
import { detail } from "@/rollo/type/types/component/factories/detail";
import { for_ } from "@/rollo/type/types/component/factories/for_";
import { handlers } from "@/rollo/type/types/component/factories/handlers";
import { name } from "@/rollo/type/types/component/factories/name";
import { props } from "@/rollo/type/types/component/factories/props";
import { send } from "@/rollo/type/types/component/factories/send";
import { shadow } from "@/rollo/type/types/component/factories/shadow";
import { sheets } from "@/rollo/type/types/component/factories/sheets";
import { style } from "@/rollo/type/types/component/factories/style";
import { text } from "@/rollo/type/types/component/factories/text";
import { uid } from "@/rollo/type/types/component/factories/uid";
import { value } from "@/rollo/type/types/component/factories/value";

/* Component tools */
import { append } from "@/rollo/type/types/component/tools/append";

/* Options for type-creation */
const ATTRIBUTE = "attribute_";
const CSS_VAR = "__";
const DATA = "data_";
const ON = "on_";
const observedAttributes = [];

const macro = (tag, ...args) => {
  const base = document.createElement(tag).constructor;
  if (base === HTMLUnknownElement) {
    return;
  }
  /* Universal factories */
  const factories = [
    attribute,
    classes,
    content,
    connected,
    css_vars,
    data,
    descendants,
    detail,
    handlers,
    props,
    send,
    sheets,
    style,
    uid,
  ];
  /* Amend factories depending on tag */
  const reference_element = document.createElement(tag);
  if (tag === "label") {
    factories.push(for_);
  }
  if (!("name" in reference_element)) {
    factories.push(name);
  }
  if (can_have_shadow(reference_element)) {
    factories.push(shadow);
  }
  if ("textContent" in reference_element) {
    factories.push(text);
  }
  if (!("value" in reference_element)) {
    factories.push(value);
  }
  /* Create composition */
  const composition = type.compose(
    base,
    { config: { ATTRIBUTE, CSS_VAR, DATA, ON, observedAttributes } },
    ...factories
  );

  /* Create Component class */
  class Component extends composition {
    static observedAttributes = observedAttributes;
    static name = "Component";
    #config;
    constructor({ config } = {}) {
      super();
      this.setAttribute("web-component", "");
      if (config) {
        config = { ...config };
      } else {
        config = {};
      }
      this.#config = Object.freeze(config);
    }

    /* Returns config. */
    get config() {
      return this.#config;
    }
  }
  /* Register Component class as type */
  const cls = type.register(Component, tag);
  /* Register Component class as non-autonomous web component */
  customElements.define(`native-${tag}`, cls, {
    extends: tag,
  });
};
/* Register macro to enable on-demand registration of non-autonomous web 
components */
type.macros.add(macro);

/* Creates, configures and returns instance of non-autonomous web component. */
export const Component = (
  arg,
  { config, classes, parent, shadow, sheet, ...updates } = {},
  ...args
) => {
  /* Parse arguments */
  const [tag, ...css_classes] = arg.split(".");
  if (classes) {
    classes = [...css_classes, ...classes];
  } else {
    classes = css_classes;
  }
  const children = args.filter((n) => is_node(n));
  const hooks = args.filter((h) => typeof h === "function");
  const sheets = args.filter((s) => s instanceof CSSStyleSheet);

  const element = type.create(tag, { config });

  /* Apply arguments */
  if (classes.length) {
    element.classes.add(...classes);
  }
  element.update(updates);
  element.append(...children);

  if (sheets.length) {
    element.sheets.add(...sheets);
  }
  append(parent, element);

  const deferred = [];
  hooks.forEach((h) => {
    const result = h.call(element, element);
    if (typeof result === "function") {
      deferred.push(result);
    } else if (Array.isArray(result)) {
      element.append(...result);
    } else if (result !== undefined) {
      element.append(result);
    }
  });
  if (deferred.length) {
    setTimeout(() => {
      deferred.forEach((h) => h.call(element, element));
    }, 0);
  }

  return element;
};

/* Creates, configures and returns instance of non-autonomous web component. 
NOTE
- Syntactical alternative to 'Component' function. */
export const component = new Proxy(
  {},
  {
    get: (target, tag) => {
      return (...args) => {
        let classes;
        let kwargs = {};

        if (args.length) {
          if (typeof args[0] === "string") {
            classes = args.shift();
            classes = classes.split(".");
          }
          if (args.length) {
            if (!(args[0] instanceof HTMLElement)) {
              kwargs = args.shift();
            }
          }
        }

        kwargs.classes = classes;

        return Component(tag, kwargs, ...args);
      };
    },
  }
);
