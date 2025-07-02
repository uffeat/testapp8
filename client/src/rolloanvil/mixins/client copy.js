/*
import client from "@/rolloanvil/mixins/client.js";
20250701
v.1.1
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
      submission: 0,
      promises: {},
    };

    __new__() {
      super.__new__?.();
      const owner = this;

      this.id = `${this.constructor.__key__}-${this.constructor.id()}`;
      this.attribute[this.constructor.__key__] = true;

      /* Load */
      (() => {
        const { promise, resolve } = Promise.withResolvers();
        this.#_.promises.load = promise;

        this.on.load$once = (event) => {
          delete this.#_.promises.load;
          resolve(this);
        };
      })();

      /* client */
      (() => {
        const call = async (name, data = {}, { timeout } = {}) => {
          await this.connect();

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

    /* Returns controller for calling Anvil app's client-side callables. */
    get client() {
      return this.#_.client;
    }

    /* Returns flag that indicates, if iframe has been loaded and 
    handshake completed. */
    get ready() {
      return this.#_.ready || false;
    }

    /* Performs handshake with iframe to establish secure communication bridge. 
    NOTE Automatically invoked when calling client api's, so only needs to be 
    called explicitly, if no client api's are called, but channels are used. */
    async connect({ timeout } = {}) {
      const owner = this;

      if (this.#_.ready) {
        return this;
      }

      if (this.#_.promises.load) {
        await this.#_.promises.load;
      }

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
        owner.#_.ready = true;
        resolve(owner);
        window.removeEventListener("message", onhandshake);
      }

      window.addEventListener("message", onhandshake);
      this.contentWindow.postMessage({ id: this.id }, this.origin);

      return promise;
    }
  };
};
