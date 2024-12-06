import { check_factories } from "rollo/utils/check_factories";
import { reactive } from "rollo/factories/__factories__";

/* Factory that set connected state. */
export const connected = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([reactive], factories);

  const cls = class Connected extends parent {
    #set_connected;

    created_callback(...args) {
      super.created_callback && super.created_callback(...args);
      this.#set_connected = this.protected.add("connected");
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.#set_connected(true);
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      this.#set_connected(false);
    }

    get connected() {
      return this.$.connected;
    }
  };
  return cls;
};
