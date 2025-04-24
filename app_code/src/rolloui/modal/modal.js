//import { modal } from "rolloui/modal/modal";

import { Modal } from "bootstrap";
import { component } from "rollo/component/component.js";

import html from "rolloui/modal/assets/template.html?raw";

export const modal = () => {
  const element = component.div("modal", {
    data_bsBackdrop: "static",
    data_bsKeyboard: false,
    tabIndex: -1,
    ariaLabelledby:"staticBackdropLabel",
     ariaHidden:'true'
  });
  element.innerHTML = html;
  const modal = new Modal(element);
  document.body.append(element);
  modal.show();
};
