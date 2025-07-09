/*
import { Channels } from "@/rolloanvil/tools/channels.js";
*/

import { Message } from "@/rolloanvil/tools/message.js";

export class Channels {
  #_ = {
    registry: new Map(),
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  get owner() {
    return this.#_.owner;
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
      window.addEventListener("message", this.#onchannel);
      this.#_.active = true;
    }

    return this.owner;
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
      window.removeEventListener("message", this.#onchannel);
      this.#_.active = false;
    }
    return this.owner;
  }

  /* Quasi-permanent message handler for channels. */
  #onchannel = async (event) => {
    const message = Message(event);
    /* Filter-out non-relevant events. */
    if (this.owner.origin !== message.origin) {
      return;
    }
    if (this.owner.id !== message.id) {
      //
      return;
    }
    if (!message.channel) return;
    /* Syntactical alternatives (identical result):
    if (!('channel' in message)) return;
    if (!message.has('channel')) return;
    */

    /* Invoke channel (effect) */
    if (this.has(message.channel)) {
      const effect = this.get(message.channel);
      effect.call(this.owner, message.data, {
        effect,
        channel: message.channel,
        owner: this.owner,
      });
    }
  };
}
