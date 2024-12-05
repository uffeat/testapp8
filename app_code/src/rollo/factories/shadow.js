import { check_factories } from "rollo/utils/check_factories";
import { base } from "rollo/factories/__factories__";

/* Factory that controls childnode-related state. 
For components that support shadow dom */
export const shadow = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([base], factories);

  const cls = class Shadow extends parent {
    #set_has_children;
    #set_has_content;

    created_callback(...args) {
      super.created_callback && super.created_callback(...args);
      /* Init shadow-dom-enabled protected state */
      this.#set_has_children = this.reactive.protected.add(
        "has_children",
        false
      );
      this.#set_has_content = this.reactive.protected.add("has_content", false);

      this.attachShadow({ mode: "open" });
      const slot = document.createElement("slot");
      this.shadowRoot.append(slot);

      slot.addEventListener("slotchange", (event) => {
        // Update protected state
        this.#set_has_children(this.children.length > 0);
        this.#set_has_content(this.childNodes.length > 0);
      });
    }
  };
  return cls;
};
