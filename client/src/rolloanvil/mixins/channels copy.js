/*
import channels from "@/rolloanvil/mixins/channels.js";
20250701
v.1.1
*/

import { Message } from "@/rolloanvil/tools/message.js";

export default (parent) => {
  /* Enables reaction for iframe-initiated events. */
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
          /* Quasi-permanent message handler for channels. */
          this.#_.onchannel = (event) => {
            const message = new Message(event);
            /* Filter-out non-relevant events. */
            if (owner.origin !== message.origin) {
              return;
            }
            if (owner.id !== message.meta.id) {
              return;
            }
            if (!("channel" in message.meta)) return;

            /* Invoke channel (effect) */
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

          /* Guard against duplicate handler registration */
          if (!this.#_.active) {
            window.addEventListener("message", this.#_.onchannel);
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
          /* Deregister handler, if no channels. */
          if (!this.size) {
            window.removeEventListener("message", this.#_.onchannel);
            this.#_.active = false;
          }
          return owner;
        }
      })();
    }

    /* Returns channels controller. */
    get channels() {
      return this.#_.channels;
    }
  };
};
