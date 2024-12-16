import { Component } from "rollo/component";
import { shadow } from "rollo/factories/__factories__";

/* Factory that adds a single slot to the shadow dom. 
Fires 'slotchange' event and calls any 'slot_change_callback' on slot change. */
export const slot = (parent, config, ...factories) => {
  /* Check factory dependencies */
  Component.factories.check([shadow], factories);

  const cls = class Slot extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      this.shadowRoot.append(this.slot);

      this.slot.addEventListener("slotchange", (event) => {
        this.send && this.send("slotchange")
        this.slot_change_callback && this.slot_change_callback();
      });
    }

    get slot() {
      return this.#slot;
    }
    #slot = document.createElement("slot");
  };
  return cls;
};
