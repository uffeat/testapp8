/* 
20250402
src/rollo/component/factories/send.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/send.js
import { send } from "rollo/component/factories/send.js";
*/

export const send = (parent, config, ...factories) => {
  return class extends parent {
    static name = "send";

    send(type, { detail, trickle, ...options } = {}) {
      if (!this.handlers.size(type)) return;
      const event =
        detail === undefined
          ? new Event(type, options)
          : new CustomEvent(type, { detail, ...options });
      this.dispatchEvent(event);
      if (trickle) {
        const elements =
          typeof trickle === "string"
            ? this.querySelectorAll(trickle)
            : this.children;

        for (const element of elements) {
          element.dispatchEvent(event);
        }
      }
      /* Return event. Useful, when detail is mutable */
      return event;
    }
  };
};
