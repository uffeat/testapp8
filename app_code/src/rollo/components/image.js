/* 
20250309
src/rollo/components/shadow.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/components/shadow.js
import { Img } from "rollo/components/img.js";
*/

import { assets } from "@/tools/assets.js";
import { Reactive } from "rollo/reactive/value.js";

import { component } from "rollo/component/component.js";
import { compose } from "rollo/tools/cls/compose.js";
import { registry } from "rollo/component/tools/registry.js";
import { Sheet } from "rollo/sheet/sheet.js";

import { attribute } from "rollo/component/factories/attribute.js";
import { content } from "rollo/component/factories/content.js";
import { css_vars } from "rollo/component/factories/css_vars.js";
import { data } from "rollo/component/factories/data.js";
import { detail } from "rollo/component/factories/detail.js";
import { handlers } from "rollo/component/factories/handlers.js";
import { parent } from "rollo/component/factories/parent.js";
import { props } from "rollo/component/factories/props.js";
import { send } from "rollo/component/factories/send.js";

Sheet(document, {
  "[rollo-image]": {
    width: "100%",
  },
});

class cls extends compose(
  HTMLImageElement,
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
  static name = "RolloImage";

  #loaded;
  #src;

  constructor() {
    super();
    this.attribute.rolloImage = true;
    this.#loaded = Reactive(false, { owner: this });
  }

  get effects() {
    return this.#loaded.effects;
  }

  get src() {
    return this.#src;
  }

  set src(src) {
    this.#src = assets.url(src);
    super.src = this.#src;

    const on_load = (event) => {
      this.#loaded.current = true;
      // Self-remove
      this.handlers.remove("load", on_load);
    };
    this.on.load = on_load;
  }
}

registry.add(cls, {
  native: "img",
});

/* Returns instance of native img component.
NOTE
- Exposes effects to allow hooking into loading cycle.
- Auto-corrects src as per environment. */
export const RolloImage = (...args) => {
  const element = component.rollo_image(...args);
  return element;
};

/* EXAMPLES

await (async () => {
  const { RolloImage } = await import("@/rollo/components/image");

  RolloImage(
    { parent: app, alt: "bevel", src: "images/bevel-low.jpg" },
    (img) => {
      img.effects.add(
        ({ current, owner, self }) => {
          // Self-remove
          owner.owner.effects.remove(self);
          // Show a larger image
          owner.owner.src = "images/bevel.jpg";
        },
        { run: false }
      );
    }
  );
})();

*/
