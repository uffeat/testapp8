/*
import { Slot } from "@/rollocomponent/slot.js";
20250605
v.1.1
*/

import { Handlers } from "@/rollocomponent/tools/handlers.js";
import { component } from "@/rollocomponent/component.js";
import { author } from "@/rollocomponent/tools/author.js";
import { compose } from "@/rollocomponent/tools/compose.js";


const cls = class extends compose('!handlers') {
  static tag = "rollo-slot"

  #_ = {};

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#_.slot = component.slot()
    this.shadowRoot.append(this.#_.slot)
    this.#_.handlers = new Handlers(this.#_.slot);
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(name) {
    this.setAttribute("name", name);
    this.#_.slot.name = name
  }
};





/* Returns instance of slot component. */
export const Slot = author(cls);
