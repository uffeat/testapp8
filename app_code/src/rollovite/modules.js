/* NOTE Do NOT import modules that uses 'modules' here! */
import { module } from "@/rollo/tools/module.js";

const PUBLIC = "/";
const SRC = "@/";

/* TODO
- Version of 'modules' in external code (e.g., code in /public), so that 
  html-files in external sources can be run 
  directly (LiveServer) and use files from
  - the external source itself
  - /public 
  - /src, provided that these files
    - do not import npm-installed modules
    - use the 'modules' syntax (or relative imports).
  This could enable an elegant way of running (certain) tests from external code.
  However, before rushing into implementation of this, take into account that:
  - An "in-app" test paradigm has indeed been established (and in such a way 
    that it does not hit the production bundle).
  - It would require refactoring of all involved /src files to use 'modules'
    for imports.
  ... therefore, if proceeding with this, perhaps limit to a few specific dir 
  scopes.
- Optional Python-like dot-syntax
  - Implement with proxies that build up an in-scope path specifier and returns
    result once a file type (or similar is encountered).
  - Handling of "secondary file types" and queries will require a special syntax
    or a cleaver (perhaps timer-based) way to terminate the proxy process.
- Build tool for processed imports
- Consider (NOT critical):
  Awesomeness of fine-grained control and flexibility aside, could perhaps 
  be simplied - not only to make 'modules' leaner, but PERHAPS also to
  - mitigate the risk of redundant module mapping (especially, if this is done
    in multiple decentralized places)
  - mitigate any inconsistencies re 
    - loader keys
    - import.meta.glob paths
    - path specifiers
    - processors
  These concerns do NOT pertain to bugs in 'modules' per se, but rather
  robustness in the face of careless/incorrect use.
*/

/* Import utility that
- builds on Vite's import features with a similar syntax and can be used
  as a drop-in replacement for static and dynamic imports
- adds platform-native features (e.g., truly native dynamic imports)
- supports import of /src as well as /public files (regardless of environment)
- can be configured 
  - for fine-grained import source control
  - to support any native and synthetic files types
  - to post-process imports (hook-like mechanism)
XXX
- Changes to code that uses 'modules' are NOT picked up by Vite's HMR, i.e., 
  a manual browser refresh is required for Vite's dev server to pick up the 
  changes (restart of the dev server is NOT required).
- Useage of modules requires that all mapped files use imports with extensions,
  i.e., cannot leave out '.js'. */
class Modules {
  #cache = {};
  #loaders;
  #processors;

  constructor() {
    this.#loaders = new Loaders();
    this.#processors = new Processors();
  }

  /* Returns controller for loaders.
  - Typically used with Vite's import.meta.glob, but can also be used for 
    - manually-created module loaders
    - "virtual module loaders" */
  get loaders() {
    return this.#loaders;
  }

  /* Returns controller for processors. */
  get processors() {
    return this.#processors;
  }

  /* Returns import result. */
  async get(specifier) {
    const path = new Path(specifier);
    let result;
    if (path.public) {
      if (path.path in this.#cache) {
        return this.#cache[path.path];
      }
      if (path.type === "js" && !path.query) {
        result = await module.import(path.path);
      } else {
        const response = await fetch(path);
        result = (await response.text()).trim();
      }
      this.#cache[path.path] = result;
    } else {
      const key = path.query
        ? `${path.extension}?${path.query}`
        : path.extension;

      const loader = this.#loaders.get(key);
      if (!loader) {
        throw new Error(`Invalid loader key: ${key}`);
      }
      /* Get load function */
      const load = loader[path.path];
      if (!load) {
        throw new Error(`Invalid path: ${path.path}`);
      }

      result = await load.call(this, { owner: this, path });
    }
    /* Perform any processing and return result */
    const key = path.query ? `${path.extension}?${path.query}` : path.extension;
    const processor = this.#processors.get(key);
    if (processor) {
      return await processor.call(this, path, result, { owner: this });
    } else {
      return result;
    }
  }
}

/* Utils... */

/* Util for managing loaders.  */
class Loaders {
  #registry = new Map();

  /* Registers loader(s). Chainable.
  NOTE
  - Multiple loaders can be added in one-go (without the need to destructure 
    into a single object).
  - Multiple loaders for multiple keys can be added in one-go.
  - Method can be called multiple times without clearing registry. */
  add(key, ...loaders) {
    
    const add = (key, ...loaders) => {
      let registered = this.#registry.get(key);
      if (!registered) {
        registered = {};
        this.#registry.set(key, registered);
      }
      for (const loader of loaders) {
        for (const [path, load] of Object.entries(loader)) {
          registered[path] = load;
        }
      }
    };

    if (typeof key === "string") {
      add(key, ...loaders);
    } else {
      /* key assumed to be a spec object for multi-key registration */
      for (const [_key, loader] of Object.entries(key)) {
        if (Array.isArray(loader)) {
          add(_key, ...loader);
        } else {
          add(_key, loader);
        }
      }
    }
    return this;
  }

  /* */
  audit() {
    const paths = new Set()
    const duplicates = []

    this.#registry.entries().forEach(([key, registered]) => Object.keys(registered).forEach((path) => {
      if (paths.has(path)) {
        duplicates.push(path)
      }
    }));



  }

  /* Returns loaders as entries for a given key.
  Returns an amalgamation of all loaders, if no key.
  NOTE
  - Primarily for debugging. */
  entries(key) {
    if (key) {
      const registered = this.#registry.get(key);
      if (registered) {
        return Object.entries(registered);
      }
    }
    return Array.from(this.#registry.values(), (registered) => Object.entries(registered));
  }

  /* Returns loader by key. */
  get(key) {
    return this.#registry.get(key);
    /* TODO
    - If no key, return an amalgamation of all loaders */
  }

  /* Checks, if a loaders with a given key has been registered. 
  Optionally, also tests if a given path is present in the loader. */
  has(key, path) {
    const registered = this.#registry.get(key);
    if (path) {
      path = new Path(path);
      if (registered) {
        return path.path in registered;
      }
      return false;
    }
    return registered ? true : false;
  }
}

/* Util for parsing patch specifier.  */
class Path {
  #extension;
  #format;
  #path;
  #public;
  #query;
  #specifier;
  #type;

  constructor(specifier) {
    this.#specifier = specifier;
  }

  /* Returns extension (format and type). */
  get extension() {
    if (this.#extension === undefined) {
      const file = this.path.split("/").reverse()[0];
      const [stem, ...meta] = file.split(".");
      this.#extension = meta.join(".");
    }
    return this.#extension;
  }

  /* Returns format ("secondary file type"). */
  get format() {
    if (this.#format === undefined) {
      this.#format = this.extension.includes(".")
        ? this.extension.split(".")[0]
        : "";
    }
    return this.#format;
  }

  /* Returns public flag (does the specifier pertain to /pulic?). */
  get public() {
    if (this.#public === undefined) {
      this.#public = this.#specifier.startsWith(PUBLIC);
    }
    return this.#public;
  }

  /* Returns specifier without query and, if public, adjusted with BASE_URL. */
  get path() {
    if (this.#path === undefined) {
      /* Remove query */
      this.#path = this.query
        ? this.#specifier.slice(0, -(this.query.length + 1))
        : this.#specifier;
      /* Correct source */
      if (this.#specifier.startsWith(PUBLIC)) {
        this.#path = `${import.meta.env.BASE_URL}${this.#path.slice(
          PUBLIC.length
        )}`;
      } else if (this.#path.startsWith(SRC)) {
        this.#path = `/src/${this.#path.slice(SRC.length)}`;
      }
    }
    return this.#path;
  }

  /* Returns any query key. */
  get query() {
    if (this.#query === undefined) {
      this.#query = this.#specifier.includes("?")
        ? this.#specifier.split("?").reverse()[0]
        : "";
    }
    return this.#query;
  }

  /* Returns file type. */
  get type() {
    if (this.#type === undefined) {
      this.#type = this.extension.includes(".")
        ? this.extension.split(".").reverse()[0]
        : this.extension;
    }
    return this.#type;
  }
}

/* Util for managing processors  */
class Processors {
  #registry = new Map();

  /* Adds processor(s). Chainable. 
  NOTE
  - Processors for multiple keys can be added in one-go. */
  add(key, processor) {
    if (typeof key === "string") {
      this.#registry.set(key, processor);
    } else {
      /* key assumed to be a spec object for multi-key registration */
      for (const [_key, processor] of Object.entries(key)) {
        this.#registry.set(_key, processor);
      }
    }
    return this;
  }

  /* Returns registered processors as entries.
  NOTE
  - Primarily for debugging. */
  entries() {
    return this.#registry.entries();
  }

  /* Returns processor by key. */
  get(key) {
    return this.#registry.get(key);
  }

  /* Checks, if a processor with a given key has been registered. */
  has(key) {
    return this.#registry.has(key);
  }
}

export const modules = new Modules();

/* Make modules global */
Object.defineProperty(window, "modules", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: modules,
});
