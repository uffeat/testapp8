import { base } from "rollo/factories/base";

/* Factory for all web components. */
export const connected = (parent, config, ...factories) => {
  if (!factories.includes(base)) {
    throw new Error(`connected factory requires base factory`);
  }

  const cls = class Connected extends parent {
    #set_connected;
    constructor(...args) {
      super(...args);
      
    }

    created_callback(...args) {
      super.created_callback && super.created_callback(...args);
      this.#set_connected = this.reactive.protected.add("connected");
     
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
      return this.$.__connected__;
    }
  };
  return cls;
};
