/*
import { Message } from "@/rolloanvil/tools/message.js";
*/

/* Util for managing message event props. */
export const Message = (event) => {
  return new Proxy(
    {},
    {
      get: (target, name) => {
        if (["origin", "source"].includes(name)) {
          return event[name];
        }
        if (name === 'has') {
          return (name) => name in event.data
          
        }
        return name in event.data ? event.data[name] : null;
      },
      has(target, name) {
        if (["origin", "source"].includes(name)) {
          return true;
        }
         return name in event.data


      },
    }
  );
};
