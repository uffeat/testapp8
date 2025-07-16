/*

*/

//import "@/rolloanvil/assets/main.css";

import { Id } from "./tools/id.js";
import { Message } from "./tools/message.js";
import { Submission } from "./tools/submission.js";

const { meta } = await use("@/meta.js");
const { author, base } = await use("@/rollocomponent/");

const cls = class extends base("iframe") {
  static __key__ = "anvil-main";

  #_ = {
    registries: {
      /* Registry for undelivered signals */
      signals: new Set(),
    },
    /* Default timeout for calling worker api's */
    timeout: 3000,
  };

  constructor() {
    super();
    const owner = this;

    this.id = `${this.constructor.__key__}-${Id.create()}`;

    /* signals */
    this.#_.signals = new (class {
      #_ = {};

      constructor(registry) {
        this.#_.registry = registry;
      }

      /* Returns number of undelivered signals. */
      get size() {
        return this.#_.registry.size;
      }

      /* Removes all undelivered signals */
      clear() {
        this.#_.registry.clear();
      }

      /* Returns undelivered signals. */
      signals() {
        this.#_.registry.values();
      }
    })(this.#_.registries.signals);

    /* receivers */
    this.#_.receivers = new (class {
      #_ = {
        registries: {
          receivers: new Set(),
        },
      };

      constructor(signals) {
        this.#_.registries.signals = signals;
      }

      /* Returns number of receivers. */
      get size() {
        return this.#_.registries.receivers.size;
      }

      /* Adds receiver. */
      add(receiver) {
        this.#_.registries.receivers.add(receiver);
        if (this.#_.registries.signals.size) {
          for (const message of this.#_.registries.signals.values()) {
            effect(message);
          }
        }
        this.#_.registries.signals.clear();
        return receiver;
      }

      /* Removes all receivers. */
      clear() {
        this.#_.registries.receivers.clear();
        return owner;
      }

      /* Returns all receivers. */
      receivers() {
        return this.#_.registries.receivers.values();
      }

      /* Removes reciver. */
      remove(receiver) {
        this.#_.registries.receivers.delete(receiver);
        return owner;
      }
    })(this.#_.registries.signals);
    window.addEventListener(
      "message",
      /* Sends signals to receivers. */
      (event) => {
        const message = Message(event);
        if (
          meta.anvil.origin !== message.origin ||
          this.id !== message.__id__ ||
          message.__type__ !== "signal"
        ) {
          return;
        }
        if (this.receivers.size) {
          for (const receiver of this.receivers.receivers()) {
            receiver.call(this, message, {
              receiver,
              owner: this,
            });
          }
        } else {
          this.#_.registries.signals.add(message);
        }
      }
    );
  }

  __new__() {
    super.__new__?.();

    this.attribute[this.constructor.__key__] = true;
    this.attribute.origin = meta.anvil.origin;

    /* Create proxy-version of 'call' */
    this.#_.api = new Proxy(
      {},
      {
        get: (target, name) => {
          return (...args) => {
            return this.call(name, ...args);
          };
        },
      }
    );
  }

  /* Returns config. */
  get config() {
    return this.#_.config;
  }

  /* Returns receivers controller. */
  get receivers() {
    return this.#_.receivers;
  }

  /* Returns controller for undelivered signals. */
  get signals() {
    return this.#_.signals;
  }

  /* Returns controller for calling api's. */
  get api() {
    return this.#_.api;
  }

  /* Calls api. */
  async call(name, data, { timeout } = {}) {
    const owner = this;
    /* Use default timeout, if non provided */
    if (timeout === undefined) {
      timeout = this.#_.timeout;
    }
    const submission = Submission.create();
    const { promise, resolve, reject } = Promise.withResolvers();
    /* iice */
    new (class {
      #_ = {};
      constructor() {
        if (![false, null].includes(timeout)) {
          this.#_.timer = setTimeout(() => {
            const error = new Error(`'${name}' did not respond in time.`);
            if (meta.env.DEV) {
              reject(error);
            } else {
              resolve(error);
            }
            window.removeEventListener("message", this.onresponse);
          }, timeout);
        }
        window.addEventListener("message", this.onresponse);
      }

      /* Returns timer id. */
      get timer() {
        return this.#_.timer;
      }

      /* Transient handler to deliver api response. */
      onresponse = async (event) => {
        const message = Message(event);
        if (
          meta.anvil.origin !== message.origin ||
          owner.id !== message.__id__ ||
          submission !== message.__submission__
        ) {
          return;
        }
        this.timer && clearTimeout(this.timer);
        if (message.__error__) {
          reject(new Error(message.__error__));
        } else {
          resolve(message.result);
        }
        window.removeEventListener("message", this.onresponse);
      };
    })();
    /* Send api request */
    const message = {
      __type__: "api",
      __id__: this.id,
      __submission__: submission,
      name,
    };
    if (data !== undefined) {
      message.data = data;
    }
    this.contentWindow.postMessage(message, meta.anvil.origin);
    return promise;
  }

  /* Initializes parent-iframe communication bridge. */
  async connect({ config, receivers, timeout } = {}) {
    /* Guard against multiple runs */
    if (this.attribute.ready) return this;
    await this.#load();
    await this.#handshake({ config, timeout });
    /* Add receivers */
    receivers && receivers.forEach((effect) => this.receivers.add(effect));
    this.attribute.ready = true;
    return this;
  }

  /* Returns promise that resolves, when handshake completed. */
  async #handshake({ config, timeout } = {}) {
    const owner = this;

    if (config) {
      this.#_.config = Object.freeze(config);
    }

    /* Use default timeout, if none provided */
    if (timeout === undefined) {
      timeout = this.#_.timeout;
    }
    const { promise, resolve, reject } = Promise.withResolvers();
    /* Register message handler with timeout.
    Wrap in a class instance, so that timeout and message handler 
    can ref each other without the use of 'function' - and to encapsulate. */
    new (class {
      #_ = {};
      constructor() {
        if (![false, null].includes(timeout)) {
          this.#_.timer = setTimeout(() => {
            const error = new Error(`Handshake did not complete in time.`);
            meta.end.DEV ? reject(error) : resolve(error);
            window.removeEventListener("message", this.onhandshake);
          }, timeout);
        }
        window.addEventListener("message", this.onhandshake);
      }

      /* Returns timer id. */
      get timer() {
        return this.#_.timer;
      }

      /* Transient handler to complete handshake. */
      onhandshake = async (event) => {
        const message = Message(event);
        if (meta.anvil.origin !== message.origin) return;
        if (owner.id !== message.__id__) return;
        this.timer && clearTimeout(this.timer);
        if (meta.env.DEV) console.info(`Handshake completed.`);
        resolve(owner);
        window.removeEventListener("message", this.onhandshake);
      };
    })();
    /* Initialize handshake */
    this.contentWindow.postMessage(
      { __id__: this.id, config },
      meta.anvil.origin
    );
    return promise;
  }

  /* Returns promise that resolves, when ifram loaded. */
  async #load() {
    const { promise, resolve } = Promise.withResolvers();
    this.on.load$once = (event) => {
      this.attribute.loaded = true;
      resolve(this);
    };
    return promise;
  }
};

const AnvilMain = author(cls);

export const main = AnvilMain({
  slot: 'anvil',
  parent: app,
  src: meta.anvil.origin,
});

await main.connect();
