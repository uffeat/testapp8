import origins from "@/rollometa/rolloanvil/origins.json";
import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";

const BASE_ORIGIN =
  import.meta.env.VERCEL_ENV === "production"
    ? origins.production
    : origins.development;

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
    this.id = this.constructor.id();
  }

  /* . */
  __new__() {
    super.__new__?.();
    this.attribute[this.constructor.__key__] = true;

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

  get src() {
    return this.#_.src || BASE_ORIGIN;
  }

  set src(src) {
    if (this.#_.src) {
      throw new Error(`'src' cannot be changed.`);
    }

    this.#_.src = `${BASE_ORIGIN}/${src}`;
  }

  /* Calls "client-side endpoint" and returns result. */
  async call(name, data, options = {}) {
    const owner = this;

    if (!this.#_.ready) {
      await this.#_.promise;
    }

    const submission = this.#_.submission++;
    const { promise, resolve, reject } = Promise.withResolvers();

    new Listener({
      data,
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
    this.#_.resolve = resolve;

    this.on.load$once = (event) => {
      this.#_.ready = true;
      this.#_.resolve(this);
    };
  }
};

export const Client = author(cls);

class Listener {
  #_ = {};

  constructor({
    data,
    name,
    options = {},
    owner,
    reject,
    resolve,
    submission,
  }) {
    this.#_.data = data;
    this.#_.name = name;
    this.#_.owner = owner;
    this.#_.submission = submission;
    this.#_.options = options;
    this.#_.reject = reject;
    this.#_.resolve = resolve;

    if (![false, null].includes(this.options.timeout)) {
      this.#_.timer = setTimeout(() => {
        const error = new Error(
          `'${name}' did not respond in time for submission: ${this.submission}.`
        );
        if (import.meta.env.DEV) {
          this.reject(error);
        } else {
          this.resolve(error);
        }
        window.removeEventListener("message", this.onmessage);
      }, this.options.timeout === undefined ? this.owner.config.timeout : this.options.timeout);
    } 

    this.#_.onmessage = (event) => {
      console.log('RUNNING')//
      if (!event.data || !event.origin || !event.source) return;
      if (event.origin !== this.owner.src) return;
      if (!event.data.meta) return;
      if (event.data.meta.id !== this.owner.id) return;
      if (event.data.meta.submission !== this.submission) return;
      this.timer && clearTimeout(this.timer);
      if (event.data.meta.error) {
        this.reject(new Error(event.data.meta.error));
      } else {
        this.resolve(event.data.data || null);
      }
      window.removeEventListener("message", this.onmessage);
    };
    window.addEventListener("message", this.onmessage);
  }

  get data() {
    return this.#_.data;
  }

  get name() {
    return this.#_.name;
  }

  get onmessage() {
    return this.#_.onmessage;
  }

  get options() {
    return this.#_.options;
  }

  get owner() {
    return this.#_.owner;
  }

  get submission() {
    return this.#_.submission;
  }

  get reject() {
    return this.#_.reject;
  }

  get resolve() {
    return this.#_.resolve;
  }

  get timer() {
    return this.#_.timer;
  }
}
