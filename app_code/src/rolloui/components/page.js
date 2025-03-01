

import { Component, component } from "rollo/component/component";
import { compose } from "rollo/tools/cls/compose";
import { Reactive } from "rollo/reactive/reactive_value";
import { registry } from "rollo/component/tools/registry";

import { attribute } from "rollo/component/factories/attribute";
import { content } from "rollo/component/factories/content";
import { css_vars } from "rollo/component/factories/css_vars";
import { data } from "rollo/component/factories/data";
import { detail } from "rollo/component/factories/detail";
import { handlers } from "rollo/component/factories/handlers";
import { parent } from "rollo/component/factories/parent";
import { props } from "rollo/component/factories/props";
import { send } from "rollo/component/factories/send";

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
