import { component } from "rollo/component/component";
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
  HTMLElement,
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
  static name = "NavComponent";
  #active;

  constructor() {
    super();
    this.#active = Reactive(null, { owner: this });
    this.attribute.navComponent = true;
    this.classList.add("nav");

    this.active.effects.add(({ current, previous }) => {
      if (previous) {
        previous.update({ ".active": null, ariaCurrent: null });
      }
      if (current) {
        current.update({ ".active": true, ariaCurrent: "page" });
      }
    });

    this.on.click = (event) => {
      event.preventDefault();
      const link = event.target.closest("a") || null;
      if (link) {
        this.active.update(link);
      }
    };
  }

  get active() {
    return this.#active;
  }
}

registry.add(cls, {
  key: "nav-component",
  native: "nav",
  tag: "nav-component",
});

export const Nav = (...args) => {
  const element = component.nav_component(...args);
  return element;
};
