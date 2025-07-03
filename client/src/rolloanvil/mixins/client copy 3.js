/*
import client from "@/rolloanvil/mixins/client.js";
20250701
v.1.2
*/

import config from "@/rolloanvil/config.json";
import { Message } from "@/rolloanvil/tools/message.js";

export default (parent) => {
  /* Enables invokation of iframe callables. */
  return class extends parent {
    static __name__ = "client";
    static id = (() => {
      let id = 0;
      return () => id++;
    })();

    #_ = {
      ready: false,
      submission: 0,
    };

    connectedCallback() {
      super.connectedCallback?.();
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.#_.ready = false;
    }

    __new__() {
      super.__new__?.();
      const owner = this;

      this.id = `${this.constructor.__key__}-${this.constructor.id()}`;
      this.attribute[this.constructor.__key__] = true;

      /* Channels */
      (() => {
        this.#_.channels = new (class {
          #_ = {
            registry: new Map(),
          };

          constructor() {
            /* Quasi-permanent message handler for channels. */
            this.#_.onchannel = async (event) => {
              await owner.connect();

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
      })();

      /* Client callables */
      (() => {
        const call = async (name, data = {}, { timeout } = {}) => {
          await owner.connect();

          const submission = this.#_.submission++;
          const { promise, resolve, reject } = Promise.withResolvers();

          const timer = (() => {
            if (![false, null].includes(timeout)) {
              return setTimeout(
                () => {
                  const error = new Error(`'${name}' did not respond in time.`);
                  if (import.meta.env.DEV) {
                    reject(error);
                  } else {
                    resolve(error);
                  }
                  window.removeEventListener("message", onresponse);
                },
                timeout === undefined ? config.timeout.client : timeout
              );
            }
          })();

          function onresponse(event) {
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

            timer && clearTimeout(timer);
            if (message.meta.error) {
              reject(new Error(message.meta.error));
            } else {
              resolve(message.data);
            }
            window.removeEventListener("message", onresponse);
          }

          window.addEventListener("message", onresponse);

          this.contentWindow.postMessage(
            { data, meta: { id: this.id, name, submission } },
            this.origin
          );

          return promise;
        };

        this.#_.client = new Proxy(
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

    /* Returns controller for calling Anvil app's client-side callables. */
    get client() {
      return this.#_.client;
    }

    /* . */
    get ready() {
      return this.#_.ready;
    }

    /* . */
    async connect({ timeout } = {}) {
      const owner = this;

      /* Abort, if ready */
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

        const timer = (() => {
          if (![false, null].includes(timeout)) {
            return setTimeout(
              () => {
                const error = new Error(`Handshake did not complete in time.`);
                if (import.meta.env.DEV) {
                  reject(error);
                } else {
                  resolve(error);
                }
                window.removeEventListener("message", onhandshake);
              },
              timeout === undefined ? config.timeout.client : timeout
            );
          }
        })();

        function onhandshake(event) {
          if (owner.origin !== event.origin) {
            return;
          }
          if (owner.id !== event.data.id) {
            return;
          }
          timer && clearTimeout(timer);

          resolve(owner);
          window.removeEventListener("message", onhandshake);
        }

        window.addEventListener("message", onhandshake);
        this.contentWindow.postMessage({ id: this.id }, this.origin);

        return promise;
      })();

      this.#_.ready = true;
      return this;
    }
  };
};
