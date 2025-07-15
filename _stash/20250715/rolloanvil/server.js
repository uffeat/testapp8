/*
import { server } from "@/rolloanvil/server.js";
*/

import { meta } from "@/meta.js";

const __server__ = new (class {
  #_ = {
    base: `${meta.anvil.origin}/_/api`,
    options: {
      headers: { "content-type": "text/plain" },
      method: "POST",
    },
    submission: 0,
    timeout: 3000,
  };

  constructor() {}

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
          timeout === undefined ? this.#_.timeout : timeout
        );
      }
    })();

    let url;
    if (meta.env.DEV) {
      const response = await fetch(`/secrets.json`);
      const secrets = await response.json();
      const key = secrets["anvil.uplink.client.development"];
      url = `${this.#_.base}/${name}?key=${key}&submission=${this.#_
        .submission++}`;
    } else {
      url = `${this.#_.base}/${name}?submission=${this.#_.submission++}`;
    }

    const response = await fetch(url, {
      body: JSON.stringify(data), ////
      ...this.#_.options,
    });

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
        if (meta.env.DEV) {
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

export const server = new Proxy(
  {},
  {
    get: (target, name) => {
      return (...args) => {
        return __server__.call(name, ...args);
      };
    },
  }
);
