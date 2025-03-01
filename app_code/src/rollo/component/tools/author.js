//import { author } from "@/rollo/component/tools/author";

import { compose } from "@/rollo/tools/cls/compose";
import { registry } from "@/rollo/component/tools/registry";

//import { aria } from "@/rollo/component/factories/aria";
import { attribute } from "@/rollo/component/factories/attribute";
import { classes } from "@/rollo/component/factories/classes";
import { connected } from "@/rollo/component/factories/connected";
import { content } from "@/rollo/component/factories/content";
import { css_vars } from "@/rollo/component/factories/css_vars";
import { data } from "@/rollo/component/factories/data";
import { detail } from "@/rollo/component/factories/detail";
import { for_ } from "@/rollo/component/factories/for_";
import { handlers } from "@/rollo/component/factories/handlers";
import { name } from "@/rollo/component/factories/name";
import { parent } from "@/rollo/component/factories/parent";
import { path } from "@/rollo/component/factories/path";
import { props } from "@/rollo/component/factories/props";
import { send } from "@/rollo/component/factories/send";
import { style } from "@/rollo/component/factories/style";
import { tab } from "@/rollo/component/factories/tab";
import { text } from "@/rollo/component/factories/text";
import { value } from "@/rollo/component/factories/value";

/* Composes and registers component. Returns constructor. */
export function author(tag) {
  const reference = document.createElement(tag);
  const base = reference.constructor;
  if (base === HTMLUnknownElement) {
    throw new Error(`Cannot author component with tag '${tag}'. Must be native.`)
  }

  const factories = [
    ////aria,
    attribute,
    classes,
    connected,
    content,
    css_vars,
    data,
    detail,
    handlers,
    parent,
    props,
    send,
    style,
    tab
  ];
  if ("href" in reference) {
    factories.push(path);
  }
  if (tag === "label") {
    factories.push(for_);
  }
  if (!("name" in reference)) {
    factories.push(name);
  }
  if ("textContent" in reference) {
    factories.push(text);
  }
  if (!("value" in reference)) {
    factories.push(value);
  }
  const config = { observedAttributes: [] };
  class cls extends compose(base, config, ...factories) {
    static observedAttributes = config.observedAttributes;
    static name = "Native";

    #__config__ = {};
    #__dict__ = {};

    constructor() {
      super();
      this.setAttribute("web-component", "");
    }

    get __config__() {
      return this.#__config__;
    }

    get __dict__() {
      return this.#__dict__;
    }
  }

  return registry.add(cls, { tag });
}
