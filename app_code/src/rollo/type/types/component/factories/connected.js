import { Value } from "@/rollo/type/types/reactive/value/value";
import { owner } from "../../reactive/factories/owner";

export const connected = (parent, config, ...factories) => {
  return class extends parent {
    static name = "connected";

    #connected;

    __new__() {
      super.__new__ && super.__new__();
      this.#connected = Value(false, { owner: this });
    }

    /* Calls 'connected' effect and dispatches 'connected' event. */
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.#connected.$ = true;
      this.dispatchEvent(new CustomEvent("connected"));
    }

    /* Calls 'connected' effect and dispatches 'disconnected' event. */
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      this.#connected.$ = false;
      this.dispatchEvent(new CustomEvent("disconnected"));
    }

    get connected() {
      return this.#connected;
    }
  };
};
