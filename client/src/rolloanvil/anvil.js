import { component } from "@/rollocomponent/component.js";
import origins from "@/rollometa/rolloanvil/origins.json";

/* Util for Anvil-related stuff. */
export const anvil = new (class {
  #_ = {};
  constructor() {
    if (import.meta.env.VERCEL_ENV === "production") {
      this.#_.URL = origins.production;
    } else {
      this.#_.URL = origins.development;
    }

    const owner = this;

    const server = new (class {
      #_ = {
        base: `${owner.URL}/_/api`,
        options: {
          headers: { "content-type": "text/plain" },
          method: "POST",
        },
        submission: 0,
      };

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
          return (...args) => {
            return server.call(name, ...args);
          };
        },
      }
    );
  }

  /* Returns origin of Anvil app. */
  get URL() {
    return this.#_.URL;
  }

  /* Returns client api controller. */
  get client() {
    if (!this.#_.client) {
      const owner = this;

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
            src: owner.URL,
            "@load$once": (event) => {
              this.#_.iframe.resolve();
              this.#_.iframe.ready = true;
            },
            parent: app,
            slot: "anvil",
          });
        }

        /* Calls "client-side endpoint" and returns result. */
        async call(name, data = {}) {
          if (!this.#_.iframe.ready) {
            await this.#_.iframe.promise;
          }
          const submission = this.#_.submission++;
          const { promise, resolve } = Promise.withResolvers();
          this.#_.iframe.component.contentWindow.postMessage(
            { name, meta: { submission }, data },
            owner.URL
          );
          const onmessage = (event) => {
            const data = event.data || {};
            const meta = data.meta || {};
            if (meta.submission !== submission) return;
            if (meta.error) {
              console.error("meta:", meta);
              throw new Error(meta.error);
            }
            resolve(data.data || null);
            window.removeEventListener("message", onmessage);
          };
          window.addEventListener("message", onmessage);
          return promise;
        }
      })();

      this.#_.client = new Proxy(
        {},
        {
          get: (_, name) => {
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
    return this.#_.server
  }
})();
