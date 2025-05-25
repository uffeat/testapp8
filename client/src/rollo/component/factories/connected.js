/* 
20250401
src/rollo/component/factories/connected.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/connected.js
import { connected } from "rollo/component/factories/connected.js";
*/

export const connected = (parent, config, ...factories) => {
  return class extends parent {
    static name = "connected";

    /* Fires 'connected' event. */
    connectedCallback() {
      super.connectedCallback?.();
      this.dispatchEvent(new CustomEvent("connected"));
    }

    /* Fires 'disconnected' event. */
    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.dispatchEvent(new CustomEvent("disconnected"));
    }
  };
};
