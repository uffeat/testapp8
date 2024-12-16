import { Component } from "rollo/component";
import { items } from "rollo/factories/__factories__";

/* Factory that sets connected and parent state. */
export const connected = (parent, config, ...factories) => {
  /* Check factory dependencies */
  Component.factories.check([items], factories);

  const cls = class Connected extends parent {
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.$.connected = true;
      this.$.parent = this.parentElement;
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      this.$.connected = false;
      this.$.parent = null
    }

    get connected() {
      return this.$.connected;
    }
  };
  return cls;
};
