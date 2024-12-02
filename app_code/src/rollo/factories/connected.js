import { state } from "rollo/factories/state";

/* Factory for all web components. */
export const connected = (parent, config, ...factories) => {
  if (!factories.includes(state)) {
    throw new Error(`connected factory requires state factory`);
  }

  const cls = class Connected extends parent {
    #set_connected;
    constructor(...args) {
      super(...args);
      this.#set_connected = this.reactive.protected.add("__connected__");
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
