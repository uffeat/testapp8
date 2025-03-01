import { Sheet } from "rollo/sheet/sheet";
import { Sheets } from "rollo/sheet/tools/sheets";
import { compose } from "rollo/tools/cls/compose";
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

import { Shadow } from "rollo/components/shadow";
import { component } from "rollo/component/component";

Sheet(document, {
  "app-component": {
    //height: "100%",
    //flexGrow: 1,
    //display: "flex",
    //flexDirection: "column",
  },
});

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
  static name = "AppComponent";

  #shadow;
  #sheet;
  #sheets;

  constructor() {
    super();
    this.#shadow = Shadow(this, component.slot());
    this.#sheet = Sheet(document);
    this.#sheets = Sheets(document);
  }

  get shadow() {
    return this.#shadow;
  }

  get sheet() {
    return this.#sheet;
  }

  get sheets() {
    return this.#sheets;
  }
}

registry.add(cls);

export const App = (...args) => {
  const element = component.app(...args);
  element.sheets.add(...args.filter((a) => a instanceof CSSStyleSheet));
  return element;
};
