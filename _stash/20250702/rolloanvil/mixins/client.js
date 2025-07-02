/*
import client from "@/rolloanvil/mixins/client.js";
20250630
v.1.0
*/



/* TODO
- add id - also to meta */

import config from "@/rolloanvil/config.json";
import { Message } from "@/rolloanvil/tools/message.js";

export default (parent) => {
  return class extends parent {
    static __name__ = "client";

    #_ = {
      submission: 0,
    };

    constructor() {
      super();
    }

    __new__() {
      super.__new__?.();

      const owner = this;

      /* Load */
      (() => {
        const { promise, resolve } = Promise.withResolvers();
        this.#_.promise = promise;

        this.on.load$once = (event) => {
          this.#_.ready = true;
          delete this.#_.promise;
          resolve(this);
        };
      })();

      /* client */
      (() => {
        const call = async (name, data = {}, { timeout } = {}) => {
          if (this.#_.promise) {
            await this.#_.promise;
          }

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
                  window.removeEventListener("message", onmessage);
                },
                timeout === undefined ? config.timeout.client : timeout
              );
            }
          })();

          function onmessage(event) {
            const message = new Message(event, {
              id: owner.id,//
              origin: owner.origin,
              submission,
            });

            if (!message.validate()) return;

            timer && clearTimeout(timer);
            if (message.meta.error) {
              reject(new Error(message.meta.error));
            } else {
              resolve(message.data);
            }
            window.removeEventListener("message", onmessage);
          }

          window.addEventListener("message", onmessage);

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

    /* Returns promise that resolves to component, when loaded.
    NOTE Useful before operations that require iframe load.  */
    get ready() {
      if (this.#_.promise) {
        return this.#_.promise;
      }
      return new Promise((resolve, reject) => {
        resolve(this);
      });
    }

    __init__() {
      super.__init__?.();
    }
  };
};
