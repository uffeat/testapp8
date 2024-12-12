import { check_factories } from "rollo/utils/check_factories";
import { items } from "rollo/factories/__factories__";

/* Factory that controls childnode-related state. 
For components that support shadow dom */
export const shadow = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([items], factories);

  const cls = class Shadow extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(this.slot);

      this.slot.addEventListener("slotchange", (event) => {
        this.$.has_children = this.children.length > 0;
        this.$.has_content = this.childNodes.length > 0;
      });
    }

    get slot() {
      return this.#slot;
    }
    #slot = document.createElement("slot");
  };
  return cls;
};
