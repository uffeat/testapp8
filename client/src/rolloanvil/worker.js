/*
import { worker } from "@/rolloanvil/worker.js";

20250703
v.1.3
*/

import "@/rolloanvil/assets/main.css";

import { meta } from "@/rollometa/meta.js";
import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";

import { Message } from "@/rolloanvil/tools/message.js";

const cls = class extends base("iframe") {
  static __key__ = "anvil-worker";

  static id = (() => {
    let id = 0;
    return () => id++;
  })();

  #_ = {
    ready: false,
    setup: {},
    submission: 0,
    timeout: 3000,
  };

  constructor() {
    super();

    this.id = `${this.constructor.__key__}-${this.constructor.id()}`;
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#_.ready = false;
  }

  __new__() {
    super.__new__?.();
    const owner = this;

    this.attribute[this.constructor.__key__] = true;
    this.attribute.origin = this.origin;

    /* Channels */
    (() => {
      this.#_.channels = new (class {
        #_ = {
          registry: new Map(),
        };

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
            window.removeEventListener("message", this.#onchannel);
            this.#_.active = false;
          }
          return owner;
        }

        /* Quasi-permanent message handler for channels. */
        #onchannel = async (event) => {
          const message = new Message(event);
          /* Filter-out non-relevant events. */
          if (owner.origin !== message.origin) {
            return;
          }
          if (owner.id !== message.id) {//
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
      })();
    })();

    /* Client callables */
    (() => {
      const call = async (name, data, { timeout } = {}) => {
        /* Use default timeout, if non provided */
        if (timeout === undefined) {
          timeout = this.#_.timeout;
        }

        const submission = this.#_.submission++;
        const { promise, resolve, reject } = Promise.withResolvers();

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

          get timer() {
            return this.#_.timer;
          }

          onresponse = async (event) => {
            const message = new Message(event);

            /* Filter-out non-relevant events. */
            if (owner.origin !== message.origin) {
              return;
            }
            if (owner.id !== message.id) {
              return;
            }
            if (submission !== message.meta.submission) {
              return;
            }

            this.timer && clearTimeout(this.timer);
            if (message.meta.error) {
              reject(new Error(message.meta.error));
            } else {
              resolve(message.data);
            }
            window.removeEventListener("message", this.onresponse);
          };
        })();

        const message = { id: this.id, meta: {  name, submission } };
        if (data !== undefined) {
          message.data = data;
        }

        this.contentWindow.postMessage(message, this.origin);

        return promise;
      };

      this.#_.api = new Proxy(
        {},
        {
          get: (target, name) => {
            return (...args) => {
              return call(name, ...args);
            };
          },
        }
      );
    })();
  }

  /* Returns env-adjusted origin of companion Anvil app. */
  get origin() {
    return meta.anvil.origin;
  }

  /* Returns channels controller. */
  get channels() {
    return this.#_.channels;
  }

  /* Returns ready flag. */
  get ready() {
    return this.#_.ready;
  }

  /* Returns src. */
  get src() {
    return super.src;
  }

  /* Sets src from path fragment. */
  set src(path) {
    if (super.src) {
      throw new Error(`Cannot change 'src'.`);
    }
    if (path) {
      path = String(path).trim();
      if (!path.startsWith("/")) {
        path = `/${path}`;
      }
      super.src = `${this.origin}${path}`;
    } else {
      super.src = this.origin;
    }
  }

  /* Returns setup. */
  get setup() {
    return this.#_.setup;
  }

  /* Returns controller for calling Anvil app's client-side callables. */
  get api() {
    return this.#_.api;
  }

  async #load() {
    const { promise, resolve } = Promise.withResolvers();
    this.on.load$once = (event) => {
      console.log(`iframe with id ${this.id} loaded`); ////
      resolve(this);
    };
    return promise;
  }

  /* Initializes parent-iframe communication bridge. */
  async connect({ timeout } = {}) {
    const owner = this;

    /* Guard against multiple runs */
    if (this.#_.ready) {
      return this;
    }

    /* Use default timeout, if non provided */
    if (timeout === undefined) {
      timeout = this.#_.timeout;
    }

    /* Load */
    await this.#load();

    /* Handshake */
    await (() => {
      const { promise, resolve, reject } = Promise.withResolvers();

      /* Register message handler with timeout.
        NOTE Wrapped in a class instance, so that timeout and message handler 
        can ref each other without the use of 'function' - and to encapsulate. */
      new (class {
        #_ = {};
        constructor() {
          if (![false, null].includes(timeout)) {
            this.#_.timer = setTimeout(() => {
              const error = new Error(`Handshake did not complete in time.`);
              if (import.meta.env.DEV) {
                reject(error);
              } else {
                resolve(error);
              }
              window.removeEventListener("message", this.onhandshake);
            }, timeout);
          }
          window.addEventListener("message", this.onhandshake);
        }

        get timer() {
          return this.#_.timer;
        }

        onhandshake = async (event) => {
          if (owner.origin !== event.origin) {
            return;
          }
          if (owner.id !== event.data.id) {
            return;
          }
          this.timer && clearTimeout(this.timer);
          if (meta.env.DEV) {
            console.info(`Handshake completed.`);
          }
          resolve(owner);
          window.removeEventListener("message", this.onhandshake);

          if (event.data.setup) {
            Object.assign(owner.setup, event.data.setup);
          }
          Object.freeze(owner.setup);
        };
      })();

      this.contentWindow.postMessage({ id: this.id }, this.origin);

      return promise;
    })();

    this.#_.ready = true;
    return this;
  }

  __init__() {
    super.__init__?.();
    /* Set default src, if none provided */
    if (!String(super.src).trim()) {
      super.src = `${this.origin}/main`;
    }
  }
};

/* Returns component instance from which 
- server endpoint calls can be made.
- "client endpoint" calls can be made. These are endpoint-like callables that 
  reside in the companion Anvil app's client code and can be used as a 
  Python-based worker with full access to DOM apis.
- "channels" can be setup. */
const AnvilWorker = author(cls);

export const worker = AnvilWorker({
  //parent: document.head,
  parent: app,
});

await worker.connect();
