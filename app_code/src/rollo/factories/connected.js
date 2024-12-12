import { check_factories } from "rollo/utils/check_factories";
import { items } from "rollo/factories/__factories__";

/* Factory that set connected state. */
export const connected = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([items], factories);

  const cls = class Connected extends parent {
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.items.$.connected = true;
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      this.items.$.connected = true;
    }

    get connected() {
      return this.items.$.connected;
    }
  };
  return cls;
};
