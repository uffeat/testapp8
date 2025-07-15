/*
import { AnvilWorker, worker } from "@/rolloanvil/worker.js";

20250703
v.1.3
*/

import "@/rolloanvil/assets/main.css";

import { meta } from "@/rollometa/meta.js";
import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";
import { Message } from "@/rolloanvil/tools/message.js";

const cls = class extends base("iframe") {
  static __key__ = "anvil-worker";

  static id = (() => {
    let id = 0;
    return () => id++;
  })();

  #_ = {
    ready: false,
    setup: {},
    submission: 0,
    /* Dfault timeout for calling worker api's */
    timeout: 3000,
  };

  constructor() {
    super();
    this.id = `${this.constructor.__key__}-${this.constructor.id()}`;
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#_.ready = false;
  }

  __new__() {
    super.__new__?.();

    const owner = this;

    this.attribute[this.constructor.__key__] = true;
    this.attribute.origin = this.origin;

    /* receivers */
    this.#_.receivers = new (class {
      #_ = {
        registry: new Map(),
      };
      constructor() {
        owner.on.x_signal = async (event) => {
          const message = event.detail;
          for (const [effect, condition] of this.#_.registry.entries()) {
            if (
              condition &&
              !condition.call(owner, message, {
                condition,
                effect,
              })
            ) {
              continue;
            }
            await effect.call(owner, message, {
              condition,
              effect,
            });
          }
        };
      }

      /* */
      get size() {
        return this.#_.registry.size;
      }

      /* */
      add(effect, condition) {
        this.#_.registry.set(effect, condition);
        return effect;
      }

      /* */
      clear() {
        this.#_.registry.clear();
        return owner;
      }

      /* */
      remove(effect) {
        this.#_.registry.delete(effect);
        return owner;
      }
    })();

    /* Create proxy-version of 'call' */
    this.#_.api = new Proxy(
      {},
      {
        get: (target, name) => {
          return (...args) => {
            return this.call(name, ...args);
          };
        },
      }
    );
  }

  /* Returns config. */
  get config() {
    return this.#_.config;
  }

  /* Returns env-adjusted origin of companion Anvil app. */
  get origin() {
    return meta.anvil.origin;
  }

  /* Return papi controller. */
  get papi() {
    return this.#_.papi;
  }

  /* Returns ready flag. */
  get ready() {
    return this.#_.ready;
  }

  /* Returns receivers controller. */
  get receivers() {
    return this.#_.receivers;
  }

  /* Returns src. */
  get src() {
    return super.src;
  }

  /* Sets src from path fragment. */
  set src(path) {
    if (super.src) {
      throw new Error(`Cannot change 'src'.`);
    }
    if (path) {
      path = String(path).trim();
      if (!path.startsWith("/")) {
        path = `/${path}`;
      }
      super.src = `${this.origin}${path}`;
    } else {
      super.src = this.origin;
    }
  }

  /* Returns setup. */
  get setup() {
    return this.#_.setup;
  }

  /* Returns controller for calling Anvil app's client-side callables. */
  get api() {
    return this.#_.api;
  }

  /* Calls worker api. */
  async call(name, data, { timeout } = {}) {
    const owner = this;

    /* Use default timeout, if non provided */
    if (timeout === undefined) {
      timeout = this.#_.timeout;
    }

    const submission = this.#_.submission++;
    const { promise, resolve, reject } = Promise.withResolvers();

    /* iice */
    new (class {
      #_ = {};
      constructor() {
        if (![false, null].includes(timeout)) {
          this.#_.timer = setTimeout(() => {
            const error = new Error(`'${name}' did not respond in time.`);
            if (meta.env.DEV) {
              reject(error);
            } else {
              resolve(error);
            }
            window.removeEventListener("message", this.onresponse);
          }, timeout);
        }
        window.addEventListener("message", this.onresponse);
      }

      get timer() {
        return this.#_.timer;
      }

      onresponse = async (event) => {
        const message = Message(event);
        if (
          owner.origin !== message.origin ||
          owner.id !== message.__id__ ||
          submission !== message.__submission__
        ) {
          return;
        }

        this.timer && clearTimeout(this.timer);
        if (message.__error__) {
          reject(new Error(message.__error__));
        } else {
          resolve(message.result);
        }
        window.removeEventListener("message", this.onresponse);
      };
    })();

    const message = {
      __type__: "api",
      __id__: this.id,
      __submission__: submission,
      name,
    };
    if (data !== undefined) {
      message.data = data;
    }
    this.contentWindow.postMessage(message, this.origin);
    return promise;
  }

  /* Initializes parent-iframe communication bridge. */
  async connect({ config, papi, receivers, timeout } = {}) {
    const owner = this;

    /* Guard against multiple runs */
    if (this.#_.ready) {
      return this;
    }
    await this.#load();

    await this.#handshake({ config, timeout });

    /* Set up special-purpose permanent handler for importing assets from 
    worker */
    window.addEventListener("message", async (event) => {
      const message = Message(event);
      if (
        this.origin !== message.origin ||
        this.id !== message.__id__ ||
        message.__type__ !== "use" ||
        !message.path
      ) {
        return;
      }
      const text = await use(message.path, { raw: true });
      this.contentWindow.postMessage(
        { __type__: "use", __id__: this.id, path: message.path, text },
        this.origin
      );
    });

    /* Set up permanent handler for re-sending signals from worker */
    window.addEventListener("message", async (event) => {
      const message = Message(event);
      if (
        this.origin !== message.origin ||
        this.id !== message.__id__ ||
        message.__type__ !== "signal"
      ) {
        return;
      }
      this.send("x_signal", { detail: message });
    });

    this.#_.papi = new (class {
      #_ = {
        registry: new Map(),
      };

      add(name, target) {
        this.#_.registry.set(name, target);
      }

      get(name) {
        return this.#_.registry.get(name);
      }

      has(name) {
        return this.#_.registry.has(name);
      }

      remove(name) {
        this.#_.registry.delete(name);
        return owner;
      }
    })();
    /* Add receivers */
    if (receivers) {
      receivers.forEach((item) => {
        if (Array.isArray(item)) {
          this.receivers.add(...item);
        } else {
          this.receivers.add(item);
        }
      });
    }

    /* Set up permanent handler for papi */
    window.addEventListener("message", async (event) => {
      const message = Message(event);
      if (
        this.origin !== message.origin ||
        this.id !== message.__id__ ||
        message.__type__ !== "papi" ||
        !message.name ||
        !("__submission__" in message)
      ) {
        return;
      }

      /* TODO Error */
      if (!this.papi.has(message.name)) {
        return;
      }

      const target = this.papi.get(message.name);
      const result = await target.call(this, message.data, {
        owner: this,
        name: message.name,
        submission: message.__submission__,
        target,
      });

      const _message = {
        __type__: "papi",
        __id__: this.id,
        __submission__: message.__submission__,
        name: message.name,
        result,
      };

      this.contentWindow.postMessage(_message, this.origin);
    });
    /* Add papi's */
    if (papi) {
      Object.entries(papi).forEach(([name, target]) =>
        this.papi.add(name, target)
      );
    }

    this.#_.ready = true;
    return this;
  }

  /* */
  signal(data) {
    this.contentWindow.postMessage(
      { __type__: "signal", __id__: this.id, data },
      this.origin
    );
    return this
  }

  __init__() {
    super.__init__?.();
    /* Set default src, if none provided */
    if (!String(super.src).trim()) {
      super.src = `${this.origin}/main`;
    }
  }

  /* Returns promise that resolves, when handshake completed. */
  async #handshake({ config, timeout } = {}) {
    if (config) {
      this.#_.config = Object.freeze(config);
    }

    const owner = this;

    /* Use default timeout, if none provided */
    if (timeout === undefined) {
      timeout = this.#_.timeout;
    }

    const { promise, resolve, reject } = Promise.withResolvers();
    /* Register message handler with timeout.
    NOTE Wrapped in a class instance, so that timeout and message handler 
    can ref each other without the use of 'function' - and to encapsulate. */
    new (class {
      #_ = {};
      constructor() {
        if (![false, null].includes(timeout)) {
          this.#_.timer = setTimeout(() => {
            const error = new Error(`Handshake did not complete in time.`);
            if (meta.env.DEV) {
              reject(error);
            } else {
              resolve(error);
            }
            window.removeEventListener("message", this.onhandshake);
          }, timeout);
        }
        window.addEventListener("message", this.onhandshake);
      }

      get timer() {
        return this.#_.timer;
      }

      onhandshake = async (event) => {
        const message = Message(event);

        if (owner.origin !== message.origin) {
          return;
        }
        if (owner.id !== message.__id__) {
          return;
        }
        this.timer && clearTimeout(this.timer);
        if (meta.env.DEV) {
          console.info(`Handshake completed.`);
        }
        resolve(owner);
        window.removeEventListener("message", this.onhandshake);

        if (message.setup) {
          Object.assign(owner.setup, message.setup);
        }
        Object.freeze(owner.setup);
      };
    })();

    this.contentWindow.postMessage({ __id__: this.id, config }, this.origin);

    return promise;
  }

  /* Returns promise that resolves, when ifram loaded. */
  async #load() {
    const { promise, resolve } = Promise.withResolvers();
    this.on.load$once = (event) => {
      //console.log(`iframe with id ${this.id} loaded`);////
      resolve(this);
    };
    return promise;
  }
};

/* . */
export const AnvilWorker = author(cls);

export const worker = AnvilWorker({
  //parent: document.head,
  parent: app,
});

//await worker.connect();
