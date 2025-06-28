/*
import { anvil } from "@/rolloanvil/anvil.js";
const { anvil } = await use("@/rolloanvil/anvil.js");
*/

import { component } from "@/rollocomponent/component.js";


/* Util for Anvil-related stuff. */
export const anvil = new (class {
  #_ = {};
  constructor() {
    this.#_.config = new (class {
      #_ = {};

      get origins() {
        return this.#_.origins;
      }

      set origins(origins) {
        this.#_.origins = origins;
      }
    })();
  }

  get config() {
    return this.#_.config;
  }

  /* Returns origin of Anvil app. */
  get origin() {
    if (import.meta.env.VERCEL_ENV === "production") {
      return this.config.origins.production;
    }
    return this.config.origins.development;
  }

  /* Returns client api controller. */
  get client() {
    if (!this.#_.client) {
      const anvil = this;

      const client = new (class {
        #_ = {
          iframe: {},
          submission: 0,
        };

        constructor() {
          (() => {
            const { promise, resolve } = Promise.withResolvers();
            this.#_.iframe.promise = promise;
            this.#_.iframe.resolve = resolve;
          })();
          this.#_.iframe.component = component.iframe("anvil", {
            src: anvil.origin,
            "@load$once": (event) => {
              this.#_.iframe.resolve();
              this.#_.iframe.ready = true;
            },
            parent: app,
            slot: "anvil",
          });

          this.#_.config = new (class {
            #_ = {
              timeout: 3000,
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

        /* Calls "client-side endpoint" and returns result. */
        async call(name, data = {}) {
          if (!this.#_.iframe.ready) {
            await this.#_.iframe.promise;
          }
          const submission = this.#_.submission++;
          const { promise, resolve, reject } = Promise.withResolvers();

          const timer = setTimeout(() => {
            console.error('submission:', submission)
            const error = new Error(
              `Client api '${name}' did not respond in time.`
            );
            if (import.meta.env.DEV) {
              reject(error);
            } else {
              resolve(error);
            }

            window.removeEventListener("message", onmessage);
          }, this.config.timeout);

          this.#_.iframe.component.contentWindow.postMessage(
            { name, submission, data },
            anvil.origin
          );

          function onmessage(event) {

            //console.log('event:', event)////


            if (!event.origin || event.origin !== anvil.origin) return;
            const data = event.data || {};
            if (data.submission !== submission) return;
            clearTimeout(timer);
            if (data.error) {
              reject(new Error(data.error));
            } else {
              resolve(data.data || null);
            }
            window.removeEventListener("message", onmessage);
          }
          window.addEventListener("message", onmessage);

          return promise;
        }
      })();

      this.#_.client = new Proxy(
        {},
        {
          get: (_, name) => {
            if (name in client) {
              return client[name];
            }
            return (...args) => {
              return client.call(name, ...args);
            };
          },
        }
      );
    }
    return this.#_.client;
  }

  /* Returns server api controller. */
  get server() {
    if (!this.#_.server) {
      const anvil = this;

      const server = new (class {
        #_ = {
          base: `${anvil.origin}/_/api`,
          options: {
            headers: { "content-type": "text/plain" },
            method: "POST",
          },
          submission: 0,
        };

        get submission() {
          return this.#_.submission;
        }

        /* Sends post request to server endpoint and returns parsed response. */
        async call(name, data = {}, { raw = false } = {}) {
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
            return response.text();
          }
          const result = await response.json();
          /* Check for error cue */
          if ("__error__" in result) {
            throw new Error(result.__error__);
          }
          return result;
        }
      })();

      this.#_.server = new Proxy(
        {},
        {
          get: (_, name) => {
            if (name in server) {
              return server[name];
            }
            return (...args) => {
              return server.call(name, ...args);
            };
          },
        }
      );
    }
    return this.#_.server;
  }
})();

anvil.config.origins = Object.freeze({
  development: "https://testapp8dev.anvil.app",
  production: "https://testapp8.anvil.app",
});

