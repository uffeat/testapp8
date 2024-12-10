import { check_factories } from "rollo/utils/check_factories";
import { reactive } from "rollo/factories/__factories__";

/* Factory that set connected state. */
export const connected = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([reactive], factories);

  const cls = class Connected extends parent {
    #set_connected;

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
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
