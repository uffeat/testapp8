/* 
20250302 
src/rollo/component/tools/registry.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/tools/registry.js
import { registry } from "rollo/component/tools/registry.js";
*/

import { pascal_to_kebab } from "@/rollo/tools/text/case.js";

class Registry extends Map {
  constructor() {
    super();
  }

  /* Registers and defines and component. Returns component class. */
  add(cls, { key, native, tag } = {}) {
    if (tag && !tag.includes("-") && !native && !key) {
      /* This concerns (auto-registered) basic native components */
      key = tag;
      native = tag;
      tag = `native-${tag}`;
    } else if (!tag && native && !key) {
      /* This concerns custom native components */
      key = tag = pascal_to_kebab(cls.name);
    } else if (!tag && !native && !key) {
      /* This concerns autonomous components */
      key = tag = pascal_to_kebab(cls.name);
    }

    if (native) {
      customElements.define(tag, cls, {
        extends: native,
      });
      //console.info(`Registered native '${native}' component with tag '${tag}' and key '${key}'.`); ////
    } else {
      customElements.define(tag, cls);
      //console.info(`Registered autonomous component with tag '${tag}' and key '${key}'.`); ////
    }

    if (this.has(key)) {
      console.warn(`Replacing '${key}' component.`);
    }

    this.set(key, cls);

    cls.__tag__ = tag

    return cls;
  }
}

/* Component registry */
export const registry = new Registry();
