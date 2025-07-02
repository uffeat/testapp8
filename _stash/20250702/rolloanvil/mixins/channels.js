/*
import channels from "@/rolloanvil/mixins/channels.js";
20250630
v.1.0
*/

import config from "@/rolloanvil/config.json";
import { Message } from "@/rolloanvil/tools/message.js";

export default (parent) => {
  return class extends parent {
    static __name__ = "channels";

    #_ = {};

    constructor() {
      super();

      const owner = this;

      this.#_.channels = new (class {
        #_ = {
          registry: new Map(),
        };

        constructor() {
          this.#_.onmessage = (event) => {
            const message = new Message(event, {
              origin: owner.origin,
            });

            if (!message.validate()) return;
            if (!("channel" in message.meta)) return;

            //console.log('event:', event)//

            if (this.has(message.meta.channel)) {
              const effect = this.get(message.meta.channel);
              effect.call(owner, message.data, {
                effect,
                channel: message.meta.channel,
                owner,
              });
            }
          };
        }

        get size() {
          return this.#_.registry.size;
        }

        add(channel, effect) {
          if (this.has(channel)) {
            throw new Error(`Duplicate channel: ${channel}`);
          }

          this.#_.registry.set(channel, effect);

          if (!this.#_.active) {
            window.addEventListener("message", this.#_.onmessage);
            this.#_.active = true;
          }

          return owner;
        }

        get(channel) {
          return this.#_.registry.get(channel);
        }

        has(channel) {
          return this.#_.registry.has(channel);
        }

        remove(channel) {
          this.#_.registry.delete(channel);

          if (!this.size) {
            window.removeEventListener("message", this.#_.onmessage);
            this.#_.active = false;
          }

          return owner;
        }
      })();
    }

    __new__() {
      super.__new__?.();
    }

    /* Returns channels controller. */
    get channels() {
      return this.#_.channels;
    }

    __init__() {
      super.__init__?.();
    }
  };
};
