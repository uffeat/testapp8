/*
import { anvil } from "@/rolloanvil/anvil.js";
const { anvil } = await use("@/rolloanvil/anvil.js");
*/


import config from "@/rolloanvil/config.json";
import { Client } from "@/rolloanvil/client.js";

/* Util for Anvil-related stuff. */
export const anvil = new (class {
  #_ = {};
  constructor() {
    this.#_.origin =
      import.meta.env.VERCEL_ENV === "production"
        ? config.origins.production
        : config.origins.development;

    const anvil = this;

    const client = Client({ slot: "data", parent: app });
    this.#_.client = new Proxy(client, {
      get: (target, name) => {
        return (...args) => {
          return target.call(name, ...args);
        };
      },
    });

    const server = new (class {
      #_ = {
        base: `${anvil.origin}/_/api`,
        options: {
          headers: { "content-type": "text/plain" },
          method: "POST",
        },
        submission: 0,
      };

      constructor() {
        this.#_.config = new (class {
          #_ = {
            timeout: config.timeout.server,
          };

          get timeout() {
            return this.#_.timeout;
          }

          set timeout(timeout) {
            this.#_.timeout = timeout;
          }
        })();
      }

      get config() {
        return this.#_.config;
      }

      get submission() {
        return this.#_.submission;
      }

      /* Sends post request to server endpoint and returns parsed response. */
      async call(name, data = {}, { raw = false, timeout } = {}) {
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
              timeout === undefined ? anvil.config.server.timeout : timeout
            );
          }
        })();

        /* NOTE 'submission' query item busts any silent browser caching and 
        provides meta for use server-side. */
        const response = await fetch(
          `${this.#_.base}/${name}?submission=${this.#_.submission++}`,
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
      }
    })();

    this.#_.server = new Proxy(server, {
      get: (target, name) => {
        return (...args) => {
          return target.call(name, ...args);
        };
      },
    });

    this.#_.config = new (class {
      #_ = {};

      get client() {
        return client.config;
      }

      get server() {
        return server.config;
      }
    })();
  }

  /* Returns client controller. */
  get client() {
    return this.#_.client;
  }

  /* . */
  get config() {
    return this.#_.config;
  }

  /* . */
  get origin() {
    return this.#_.origin;
  }

  /* Returns server controller. */
  get server() {
    return this.#_.server;
  }
})();
