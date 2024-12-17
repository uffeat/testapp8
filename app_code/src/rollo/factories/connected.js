import { Component } from "rollo/component";
import { items } from "rollo/factories/__factories__";

/* Factory that sets connected and parent state. */
export const connected = (parent, config, ...factories) => {
  /* Check factory dependencies */
  Component.factories.check([items], factories);

  const cls = class Connected extends parent {
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.items.$.connected = true;
      this.items.$.parent = this.parentElement;
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      this.items.$.connected = false;
      this.items.$.parent = null
    }

    get connected() {
      return this.items.$.connected;
    }
  };
  return cls;
};
