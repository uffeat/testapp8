/*
import { Client } from "@/rolloanvil/client.js";
const { Client } = await use("@/rolloanvil/client.js");
*/

import "@/rolloanvil/assets/main.css";
import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";
import config from "@/rolloanvil/config.json";
import { Listener } from "@/rolloanvil/tools/listener.js";

const cls = class extends base("iframe") {
  static __key__ = "anvil-client";
  static id = (() => {
    let id = 0;
    return () => id++;
  })();

  #_ = {
    submission: 0,
  };

  constructor() {
    super();
    this.id = `${this.constructor.__key__}-${this.constructor.id()}`;
    this.#_.origin =
      import.meta.env.VERCEL_ENV === "production"
        ? config.origins.production
        : config.origins.development;
  }

  /* . */
  __new__() {
    super.__new__?.();
    this.attribute[this.constructor.__key__] = true;

    this.#_.$ = new Proxy(this, {
      get: (target, name) => {
        return (...args) => {
          return target.call(name, ...args);
        };
      },
    });

    this.#_.config = new (class {
      #_ = {
        timeout: config.timeout.client,
      };

      get timeout() {
        return this.#_.timeout;
      }

      set timeout(timeout) {
        this.#_.timeout = timeout;
      }
    })();
  }

  get $() {
    return this.#_.$;
  }

  get config() {
    return this.#_.config;
  }

  get src() {
    return this.#_.src || this.#_.origin;
  }

  set src(src) {
    if (this.#_.src) {
      throw new Error(`'src' cannot be changed.`);
    }
    this.#_.src = `${this.#_.origin}/${src}`;
  }

  get submission() {
    return this.#_.submission;
  }

  /* Calls "client-side endpoint" and returns result. */
  async call(name, data, options = {}) {
    if (this.#_.promise) {
      await this.#_.promise;
    }

    const submission = this.#_.submission++;
    const { promise, resolve, reject } = Promise.withResolvers();

    new Listener({
      name,
      options,
      owner: this,
      reject,
      resolve,
      submission,
    });

    this.contentWindow.postMessage(
      { data, meta: { id: this.id, name, submission } },
      this.src
    );

    return promise;
  }

  /* . */
  __init__() {
    super.__init__?.();
    super.src = this.src;

    const { promise, resolve } = Promise.withResolvers();
    this.#_.promise = promise;

    this.on.load$once = (event) => {
      this.#_.ready = true;
      delete this.#_.promise;
      resolve(this);
    };
  }
};

export const Client = author(cls);
