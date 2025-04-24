/* 
20250320
src/rollo/app.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/app.js
*/


import { Sheet } from "rollo/sheet/sheet.js";
import { Sheets } from "rollo/sheet/tools/sheets.js";
import { compose } from "rollo/tools/cls/compose.js";
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

import { Shadow } from "rollo/components/shadow.js";
import { component } from "rollo/component/component.js";

//import { reboot } from "@/libs/bootstrap/reboot.js";



Sheet(document, {
  "rollo-app": {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    //border: "3px solid red",
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
  static name = "RolloApp";

  #shadow;
  #sheet;
  #sheets;

  constructor() {
    super();
    this.#shadow = Shadow(this, component.slot());
    this.#sheet = Sheet(document);
    this.#sheets = Sheets(document);
    //this.shadow.sheets.add(reboot);//
    this.shadow.sheet.add({
      "#root": {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        //border: "3px solid yellow",
      },
    });
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

export const app = new cls();
app.id = "app";

document.body.append(app);



