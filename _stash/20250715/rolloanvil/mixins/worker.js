/*
import client from "@/rolloanvil/mixins/client.js";
20250704
v.1.4
*/

/* TODO
- Collapse to single message listener that can also send initial data.
- Revisit idea re auto-connect from call/channel */

import { meta } from "@/rollometa/meta.js";
import { config } from "@/rolloanvil/config.js";
import { Message } from "@/rolloanvil/tools/message.js";

export default (parent) => {
  /* Enables invokation of iframe callables. */
  return class extends parent {
    static __name__ = "worker";

    
    static id = (() => {
      let id = 0;
      return () => id++;
    })();

    #_ = {
      ready: false,
      setup: {},
      submission: 0,
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
        })();
      })();

      /* Client callables */
      (() => {
        const call = async (name, data, { timeout } = {}) => {
          const submission = this.#_.submission++;
          const { promise, resolve, reject } = Promise.withResolvers();

          new (class {
            #_ = {};
            constructor() {
              if (![false, null].includes(timeout)) {
                this.#_.timer = setTimeout(
                  () => {
                    const error = new Error(
                      `'${name}' did not respond in time.`
                    );
                    if (meta.env.DEV) {
                      reject(error);
                    } else {
                      resolve(error);
                    }
                    window.removeEventListener("message", this.onmessage);
                  },
                  timeout === undefined ? config.timeout.worker : timeout
                );
              }
              window.addEventListener("message", this.onmessage);
            }

            get timer() {
              return this.#_.timer;
            }

            onmessage = async (event) => {
              const message = new Message(event);

              /* Filter-out non-relevant events. */
              if (owner.origin !== message.origin) {
                return;
              }
              if (owner.id !== message.meta.id) {
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
              window.removeEventListener("message", this.onmessage);
            };
          })();

          const message = { meta: { id: this.id, name, submission } };
          if (data !== undefined) {
            message.data = data;
          }

          this.contentWindow.postMessage(message, this.origin);

          return promise;
        };

        this.#_.worker = new Proxy(
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
    get worker() {
      return this.#_.worker;
    }

    /* Initializes parent-iframe communication bridge. */
    async connect({ timeout } = {}) {
      const owner = this;

      /* Guard against multiple runs */
      if (this.#_.ready) {
        return this;
      }

      /* Load */
      await (() => {
        const { promise, resolve } = Promise.withResolvers();
        this.on.load$once = (event) => {
          resolve(this);
        };
        return promise;
      })();

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
              this.#_.timer = setTimeout(
                () => {
                  const error = new Error(
                    `Handshake did not complete in time.`
                  );
                  if (import.meta.env.DEV) {
                    reject(error);
                  } else {
                    resolve(error);
                  }
                  window.removeEventListener("message", this.onmessage);
                },
                timeout === undefined ? config.timeout.worker : timeout
              );
            }
            window.addEventListener("message", this.onmessage);
          }

          get timer() {
            return this.#_.timer;
          }

          onmessage = async (event) => {
            if (owner.origin !== event.origin) {
              return;
            }
            if (owner.id !== event.data.id) {
              return;
            }
            this.timer && clearTimeout(this.timer);
            if (meta.env.DEV) {
              console.info(`Anvil worker ready.`)
            }
            resolve(owner);
            window.removeEventListener("message", this.onmessage);

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
};
