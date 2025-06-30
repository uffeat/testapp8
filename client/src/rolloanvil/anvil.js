/*
import { anvil } from "@/rolloanvil/anvil.js";
const { anvil } = await use("@/rolloanvil/anvil.js");
*/

import config from "@/rolloanvil/config.json";
import { Client } from "@/rolloanvil/client.js";
import { Message } from "@/rolloanvil/tools/message.js";

/* Util for Anvil-related stuff. */
export const anvil = new (class {
  #_ = {
    _: {},
  };
  constructor() {
    const anvil = this;

    /* origin */
    this.#_.origin =
      import.meta.env.VERCEL_ENV === "production"
        ? config.origins.production
        : config.origins.development;

    /* client */
    (() => {
      this.#_._.client = Client({ slot: "data", parent: app });
      this.#_.client = new Proxy(this.#_._.client, {
        get: (target, name) => {
          return (...args) => {
            return target.call(name, ...args);
          };
        },
      });
    })();

    /* server */
    (() => {
      this.#_._.server = new (class {
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

        /* Returns config controller. */
        get config() {
          return this.#_.config;
        }

        /* Returns most recent submission id. */
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

      this.#_.server = new Proxy(this.#_._.server, {
        get: (target, name) => {
          return (...args) => {
            return target.call(name, ...args);
          };
        },
      });
    })();

    /* config */
    this.#_.config = new (class {
      #_ = {};

      get client() {
        return this.#_._.client.config;
      }

      get server() {
        return this.#_._.server.config;
      }
    })();

    /* channels */
    (() => {
      this.#_.channels = new (class {
        #_ = {
          registry: new Map(),
        };

        constructor() {
          this.#_.onmessage = (event) => {
            const message = new Message(event, {
              id: anvil.#_._.client.id,
              origin: anvil.origin,
            });

            if (!message.validate()) return;
            if (!("channel" in message.meta)) return;
            if (this.has(message.meta.channel)) {
              const effect = this.get(message.meta.channel);
              effect.call(anvil, message.data);
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

          if (!this.#_.active) {
            window.addEventListener("message", this.#_.onmessage);
            this.#_.active = true;
          }

          return anvil;
        }

        get() {
          return this.#_.registry.get(channel);
        }

        has(channel) {
          return this.#_.registry.has(channel);
        }

        remove(channel) {
          this.#_.registry.delete(channel);

          if (!this.size) {
            window.removeEventListener("message", this.#_.onmessage);
            this.#_.active = false;
          }

          return anvil;
        }
      })();
    })();
  }

  /* Returns channels controller. */
  get channels() {
    return this.#_.channels;
  }

  /* Returns client controller. */
  get client() {
    return this.#_.client;
  }

  /* Returns config controller. */
  get config() {
    return this.#_.config;
  }

  /* Returns origin of Anvil companion app. */
  get origin() {
    return this.#_.origin;
  }

  /* Returns server controller. */
  get server() {
    return this.#_.server;
  }
})();
