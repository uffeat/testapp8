/* NOTE Do NOT import modules that uses 'modules' here! */
import { module } from "@/rollo/tools/module.js";

const PUBLIC = "/";
const SRC = "@/";

/* TODO
- version of 'modules' for static (/public), so that html-files in /public 
  can be run directly and use files from /src (that do not import npm-installed modules)
  as well as import other files from /public.
- test json
- test non-vite loaders 
- Python-like dot-syntax (optional) 
- Build tool for processed imports
*/

/* Import utility.
NOTE
- Can be used as a drop-in replacement for static and dynamic imports.
- Offers truly dynamic imports, incl. imports with constructed paths.
- Can be configured to support 
  - import of native and synthetic file types
  - import of static (public) assets
  - virtual modules
  - processed imported results
  e.g., by leveraging
  - file types
  - "secondary" file types ("formats"), e.g., foo.js.html
  - Vite-style import queries, e.g., foo.js?raw
  This can be implemented by setting up
  - loaders (for given file extensions).
  - processors (for given file type-query combinations.
- Can enable import from external code provided that
  - the 'modules' syntax is exclusively used in all involves files.
  - an external version of 'modules' is set up globally in the external code.   */
class Modules {
  #cache = {};
  #loaders;
  #processors;

  constructor() {
    this.#loaders = new Loaders();
    this.#processors = new Processors();
  }

  /* Returns controller for loaders.
  - Typically uses with Vite's import.meta.glob, but can also be used for 
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
      const key = path.query ? `${path.type}?${path.query}` : path.type;
      const loader = this.#loaders.get(key);
      if (!loader) {
        throw new Error(`Invalid loader key: ${path.type}`);
      }
      /* Get load function */
      const load = loader[path.path];
      if (!load) {
        throw new Error(`Invalid path: ${path.path}`);
      }
      /* */
      result = await load.call(this, { owner: this, path });
    }
    /* Perform any processing and resturn result */
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

  /* Registers loader. 
  NOTE
  - Multiple loaders can be added in one-go (without the need to destructure 
    into a single object).
  - Method can be called multiple times without clearing registry. */
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

  /* Returns loaders as entries for a given key.
  NOTE
  - Primarily for debugging. */
  entries(key) {
    if (key) {
      const registered = this.#registry.get(key);
      if (registered) {
        return Object.entries(registered);
      }
    }
    /* TODO
    - If no key, return an amalgamation of all loaders */
  }

  /* Returns loader by key. */
  get(key) {
    return this.#registry.get(key);
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

  /* Adds processor. */
  add(key, processor) {
    this.#registry.set(key, processor);
  }

  /* Returns registered processors as entries.
  NOTE
  - Primarily for debugging. */
  entries() {
    return  this.#registry.entries()
  }

  /* Returns processor by key. */
  get(key) {
    return this.#registry.get(key);
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
