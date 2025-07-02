/*
import server from "@/rolloanvil/mixins/server.js";
20250630
v.1.0
*/

import config from "@/rolloanvil/config.json";



export default (parent) => {
  return class extends parent {
    static __name__ = "server";

    #_ = {
      options: {
        headers: { "content-type": "text/plain" },
        method: "POST",
      },
      submission: 0,
    };

    constructor() {
      super();
    }

    __new__() {
      super.__new__?.();

      const call = async (name, data = {}, { raw = false, timeout } = {}) => {
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
              },
              timeout === undefined ? config.timeout.server : timeout
            );
          }
        })();

        /* NOTE 'submission' query item busts any silent browser caching and 
          provides meta for use server-side. */
        const response = await fetch(
          `${this.origin}/_/api/${name}?submission=${this.#_.submission++}`,
          {
            body: JSON.stringify(data),
            ...this.#_.options,
          }
        );

        if (raw) {
          const result = await response.text();
          timer && clearTimeout(timer);
          resolve(result);
        } else {
          const result = await response.json();
          /* Check for error cue */
          if ("__error__" in result) {
            timer && clearTimeout(timer);
            const error = new Error(result.__error__);
            if (import.meta.env.DEV) {
              reject(error);
            } else {
              resolve(error);
            }
          } else {
            timer && clearTimeout(timer);
            resolve(result);
          }
        }

        return promise;
      };

      this.#_.server = new Proxy(
        {},
        {
          get: (target, name) => {
            return (...args) => {
              return call(name, ...args);
            };
          },
        }
      );
    }

    /* Returns server controller. */
    get server() {
      return this.#_.server;
    }

    __init__() {
      super.__init__?.();
    }
  };
};
