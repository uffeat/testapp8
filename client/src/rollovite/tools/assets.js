import __types__ from "@/rollometa/public/__types__.json";
import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* TODO 
- Use Base OR only expose via 'modules' */

/* Utility for importing public files. 
NOTE
- Part of Rollo's import system. */
export const assets = new (class {
  #fetch;
  #import;

  #proxy;

  constructor() {
    const owner = this;

    this.#proxy = syntax("/", this, (part) => new Set(__types__).has(part));

    this.#fetch = new (class {
      #cache = new Map();
      async get(path) {
        let text = this.#cache.get(path);
        if (text) {
          return text;
        }
        const response = await fetch(path);
        text = (await response.text()).trim();
        this.#cache.set(path, text);
        return text;
      }
    })();

    const construct = async (text) => {
      const blob = new Blob([text], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const module = await new Function(`return import("${url}")`)();
      URL.revokeObjectURL(url);
      return module;
    };

    this.#import = new (class {
      #cache = new Map();
      async get(path) {
        let module = this.#cache.get(path);
        if (module) {
          return module;
        }
        const text = await owner.import(`${path}?raw`);
        module = await construct(`${text}\n//# sourceURL=${path}`);
        this.#cache.set(path, module);
        return module;
      }
    })();
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#proxy;
  }

  async import(path) {
    const raw = (() => {
      if (path.endsWith("?raw")) {
        path = path.slice(0, -"?raw".length);
        return true;
      }
    })();

    const type = path.split(".").reverse()[0];
    if (!raw && type === "js") {
      return await this.#import.get(path);
    }

    /* */
    path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;

    if (!raw && type === "css") {
      /* Mimic Vite: css becomes global (albeit via link) */
      const href = path;
      const rel = "stylesheet";
      const selector = `link[rel="${rel}"][href="${href}"]`;
      let link = document.head.querySelector(selector);
      /* Check, if sheet already added */
      if (!link) {
        const { promise, resolve } = Promise.withResolvers();
        link = document.createElement("link");
        link.rel = rel;
        link.href = href;
        link.onload = (event) => resolve();
        document.head.append(link);
        /* Await link load */
        await promise;
      }
      return link;
    }
    const result = await this.#fetch.get(path);
    if (!raw && type === "json") {
      return JSON.parse(result);
    }
    return result;
  }

  /*
  MOTE
  -  */
  async paths(arg) {
    const paths = await this.import("/__manifest__.json");

    if (typeof arg === "function") {
      const filter = arg;
      return paths.filter(filter);
    }
    if (typeof arg === 'string') {
      const type = arg
      // TODO
      
    }

    if (Array.isArray(arg)) {
      const types = arg
      // TODO

    }

    return paths;
  }
})();

/* TODO 
- Use Base - or go for factories! */

export class LocalAssets {
  #base;
  #processor = null;
  #proxy;
  #query;

  #type;

  constructor({ base = "", processor, query = "", type = "js" } = {}) {
    /* Enable Python-like syntax */
    this.#proxy = syntax(base ? "" : "/", this, (part) => part === type);

    this.#base = base;
    if (processor) {
      this.processor(processor);
    }
    this.#query = query;
    this.#type = type;
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#proxy;
  }

  /* Returns base. */
  get base() {
    return this.#base;
  }

  /* Returns query. */
  get query() {
    return this.#query;
  }

  /* Returns type. */
  get type() {
    return this.#type;
  }

  /* Returns import. */
  async import(path) {
    if (this.type && !path.endsWith(`.${this.type}`)) {
      path = `${path}.${this.type}`;
    }

    if (this.type) {
      const type = path.split(".").reverse()[0];
      if (this.type !== type) {
        throw new Error(`Invalid type for path: ${path}`);
      }
    }

    const result = await assets.import(`${this.base}/${path}${this.query}`);

    /* Process */
    const processor = this.processor();
    if (processor) {
      const processed = await processor.call(this, path, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        return processed;
      }
    }

    return result;
  }

  /* Combined getter/setter for 'processor':
  - If no arg, returns Processor instance, or null, if not set up.
  - If source, creates, sets and returns Processor instance from function.
  - If null arg, removes processor.
  NOTE
  - 'source' should be a (optionally) async function with the signature:
      (this, result, { owner: this, key })
    Can also be an object with a 'call' method or a Processor instance.
  - Supports (exposed) caching.
  - Supports highly dynamic patterns. 
  - undefined processor results are ignored as a means to selective 
    processing. */
  processor(source) {
    if (source) {
      if (source instanceof Processor) {
        this.#processor = source;
      } else {
        this.#processor = new Processor(this, source);
      }
    } else {
      if (source === null) {
        /* Clean up and remove processor */
        if (this.#processor instanceof Processor) {
          this.#processor.cache.clear();
        }
        this.#processor = null;
      }
    }
    return this.#processor;
  }
}
