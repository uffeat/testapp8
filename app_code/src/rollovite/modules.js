/* NOTE Do NOT import modules here that uses 'modules' */
/* TODO
- Integrate instead of import */
import { import_, text_to_module } from "@/rollovite/module.js";

/* TODO
- Path - perhaps with native URLstuff
- version of modules for static (in public)
- test json
- test non-vite loaders 
- Python-like dot-syntax (optional) 
- Build tool for processed imports 
- Perhaps externalize (in-module):
  - Loaders
  - Processors */

class Path {
  #extension;
  #format;
  #public = false;
  #query
  #path;
  #specifier
  #type
  constructor(path) {

    const file = path.split("/").reverse()[0];
    const [stem, ...meta] = file.split(".");
    meta.reverse();
    const [hot, format] = meta;
    const [type, query] = hot.split("?");
    this.#format = format
    this.#query = query
    this.#type = type



    if (path.startsWith("@/")) {
      this.#specifier = `/src/${path.slice(2)}`;
    } else if (path.startsWith("/")) {
      /* TODO 
      - Use Vite BASE */
      this.#specifier = import.meta.env.DEV ? path : `${import.meta.env.BASE_URL}${path}`;
      this.#public = true;
    } else {
      this.#specifier = path;
    }

    

    
  }

  get extension() {}

  get format() {
    return this.#format;
  }

  get public() {
    return this.#public;
  }

  get path() {
    
  }

  get type() {
    return this.#type;
  }
}

/* Import utility.
NOTE
- Can be used as a drop-in replacement for static and dynamic imports.
- Offers truly dynamic imports, incl. imports with constructed paths.
- Can be configured to support 
  - import of native and synthetic file types
  - import of static (public) assets
  - virtual modules
  - process imported results
  e.g., by leveraging
  - file types
  - "secondary" file types ("formats"), e.g., foo.js.html
  - Vite-style import queries, e.g., foo.js?raw
  This can be implemented by setting up
  - loaders (for given file types and queries).
  - processors (for given file "extensions", i.e., primary and secondary files types).
- Can enable import from external code provided that
  - the 'modules' syntax is exclusively used in all involves files.
  - an external version of 'modules' is set up globally in the external code.   */
export const modules = new (class Modules {
  #cache = {};
  #loaders;
  #processors;

  constructor() {
    /*  */
    this.#loaders = new (class Loaders {
      #registry = new Map();

      /*  */
      add(key, ...loaders) {
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
      }

      /*  */
      get(key) {
        return this.#registry.get(key);
      }
    })();

    this.#processors = new (class Processors {
      #registry = new Map();

      /*  */
      add(extension, processor) {
        this.#registry.set(extension, processor);
      }

      /*  */
      get(extension) {
        return this.#registry.get(extension);
      }
    })();
  }

  get loaders() {
    return this.#loaders;
  }

  get processors() {
    return this.#processors;
  }

  /* Returns import. */
  async get(path) {
    let public_;
    if (path.startsWith("@/")) {
      path = `/src/${path.slice(2)}`;
    } else if (path.startsWith("/")) {
     
      path = import.meta.env.DEV ? path : `${import.meta.env.BASE_URL}${path}`;
      public_ = true;
    }

    const [format, type, query] = this.#parse_path(path);

    const extension = format ? `${format}.${type}` : type;

    /* Reconstruct path without query */
    path = query ? path.slice(0, -(query.length + 1)) : path;

    let result;
    if (public_) {
      if (path in this.#cache) {
        return this.#cache[path];
      }
      if (type === "js" && !query) {
        result = await import_(path);
      } else {
        const response = await fetch(path);
        result = (await response.text()).trim();
      }
      this.#cache[path] = result;
    } else {
      /* Construct loader key */
      const key = query ? `${extension}?${query}` : extension;

      const loader = this.#loaders.get(key);
      if (!loader) {
        throw new Error(`Invalid loader key: ${key}`);
      }
      /* Get load function */
      const load = loader[path];
      if (!load) {
        throw new Error(`Invalid path: ${path}`);
      }
      /* */
      result = await load.call(this, { owner: this });
    }

    /* */
    const processor = this.#processors.get(extension);
    return processor
      ? await processor.call(this, path, result, { owner: this })
      : result;
  }

  #parse_path(path) {
    const file = path.split("/").reverse()[0];
    const [stem, ...meta] = file.split(".");
    meta.reverse();
    const [hot, format] = meta;
    const [type, query] = hot.split("?");
    return [format, type, query];
  }
})();

/* Make modules global */
Object.defineProperty(window, "modules", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: modules,
});



