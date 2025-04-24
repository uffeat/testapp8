

import { Component, component } from "rollo/component/component.js";
import { compose } from "rollo/tools/cls/compose.js";
import { Reactive } from "rollo/reactive/value.js";
import { registry } from "rollo/component/tools/registry.js";

import { attribute } from "rollo/component/factories/attribute.js";
import { content } from "rollo/component/factories/content.js";
import { css_vars } from "rollo/component/factories/css_vars.js";
import { data } from "rollo/component/factories/data.js";
import { detail } from "rollo/component/factories/detail.js";
import { handlers } from "rollo/component/factories/handlers.js";
import { parent } from "rollo/component/factories/parent.js";
import { props } from "rollo/component/factories/props.js";
import { send } from "rollo/component/factories/send.js";

class cls extends compose(
  HTMLDivElement,
  {},
  attribute,
  content,
  css_vars,
  data,
  detail,
  handlers,
  parent,
  props,
  send
) {
  static name = "PageComponent";
  #child = Reactive(null, { owner: self });

  constructor() {
    super();
    this.attribute.pageComponent = true;
    this.classList.add("container-md");

    this.child.effects.add(({ current, previous }) => {
      if (previous) {
        previous.remove();
      }
      if (current) {
        this.append(current);
      }
    });
  }

  get child() {
    return this.#child;
  }
}

registry.add(cls, {
  key: "page-component",
  native: "div",
  tag: "page-component",
});

export const Page = (...args) => {
  const element = component.page_component(...args);
  return element;
};
