import { check_factories } from "rollo/utils/check_factories";
import { reactive } from "rollo/factories/__factories__";

/* Factory that controls childnode-related state. 
For components that support shadow dom */
export const shadow = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([reactive], factories);

  const cls = class Shadow extends parent {
    #set_has_children;
    #set_has_content;

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      /* Init shadow-dom-enabled protected state */
      this.#set_has_children = this.protected.add("has_children", false);
      this.#set_has_content = this.protected.add("has_content", false);

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(this.slot);

      this.slot.addEventListener("slotchange", (event) => {
        // Update protected state
        this.#set_has_children(this.children.length > 0);
        this.#set_has_content(this.childNodes.length > 0);
      });
    }

    get slot() {
      return this.#slot;
    }
    #slot = document.createElement("slot");
  };
  return cls;
};
