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





    const timer = setTimeout(() => {
      console.error("submission:", submission);
      const error = new Error(`Client api '${name}' did not respond in time.`);
      if (import.meta.env.DEV) {
        reject(error);
      } else {
        resolve(error);
      }
      window.removeEventListener("message", onmessage);
    }, this.config.timeout);


    function onmessage(event) {
      if (!event.data || !event.origin || !event.source) return;
      if (event.origin !== owner.src) return;
      if (!event.data.meta) return;
      if (event.data.meta.id !== owner.id) return;
      if (event.data.meta.submission !== submission) return;
      clearTimeout(timer);
      if (event.data.meta.error) {
        reject(new Error(event.data.meta.error));
      } else {
        resolve(event.data.data || null);
      }
      window.removeEventListener("message", onmessage);
    }
    window.addEventListener("message", onmessage);




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

export const AnvilClient = author(cls);



class Listener {
  #_ = {}

  constructor({data, name, options = {}, owner, submission}) {
    this.#_.owner = owner
    this.#_.submission = submission
    this.#_.options = options

    if ([false, null].includes(options.timeout)) {
      //
    } else {
      //

    }

    this.#_.onmessage = (event) => {

    }



  }

  get onmessage() {
    return this.#_.onmessage

  }
}