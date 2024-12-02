import { state } from "rollo/factories/state";

/* Factory for components that support shadow dom */
export const shadow = (parent, config, ...factories) => {
  if (!factories.includes(state)) {
    throw new Error(`shadow factory requires state factory`);
  }

  const cls = class Shadow extends parent {
    #set_has_children;
    #set_has_content;
    constructor(...args) {
      super(...args);
      /* Init shadow-dom-enabled protected state */
      this.#set_has_children = this.reactive.protected.add(
        "__has_children__",
        false
      );
      this.#set_has_content = this.reactive.protected.add(
        "__has_content__",
        false
      );

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
