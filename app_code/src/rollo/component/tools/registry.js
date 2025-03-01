//import { registry } from "@/rollo/component/tools/registry";

import { pascal_to_kebab } from "@/rollo/tools/text/case";

class Registry extends Map {
  constructor() {
    super();
  }

  /* Registers and defines and component. Returns constructor. */
  add(cls, { key, native, tag } = {}) {
    if (tag && !tag.includes("-") && !native && !key) {
      /* This concerns basic native components */
      key = tag;
      native = tag;
      tag = `native-${tag}`;
    } else if (!tag && !native && !key) {
      /* This concerns autonomous components */
      tag = pascal_to_kebab(cls.name);
      key = tag.split("-")[0];
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
    return cls;
  }
}

/* Component registry */
export const registry = new Registry();
