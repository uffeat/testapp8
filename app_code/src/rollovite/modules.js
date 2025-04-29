/* NOTE Do NOT import modules here that uses 'modules' */
/* TODO
- Integrate instead of import */
import { module } from "@/rollovite/module.js";

const PUBLIC = "/";
const SRC = '@/'

/* TODO
- version of 'modules' for static (in public)
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
  
    /*  */
    get loaders() {
      return this.#loaders;
    }
  
    /*  */
    get processors() {
      return this.#processors;
    }
  
    /* Returns import. */
    async get(specifier) {
      const path = new Path(specifier);
  
      let result;
      if (path.public) {
        if (path.path in this.#cache) {
          return this.#cache[path.path];
        }
        if (path.type === "js" && !query) {
          result = await module.import(path.path);
        } else {
          const response = await fetch(path);
          result = (await response.text()).trim();
        }
        this.#cache[path.path] = result;
      } else {
        const loader = this.#loaders.get(path.type);
        if (!loader) {
          throw new Error(`Invalid loader key: ${path.type}`);
        }
        /* Get load function */
        const load = loader[path.path];
        if (!load) {
          throw new Error(`Invalid path: ${path.path}`);
        }
        /* */
        result = await load.call(this, { owner: this });
      }
  
      /* */
      if (path.query) {
        const processor = this.#processors.get(`${path.extension}?${path.query}`);
        if (processor) {
          await processor.call(this, path, result, { owner: this });
        } else {
          return result;
        }
      }
      return result;
    }
  }




/* Utils... */

/*  */
class Loaders {
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

  /* Returns loaders for a given key.
  NOTE
  - Primarily for debugging. */
  entries(key) {
    if (key) {
      const registered = this.#registry.get(key)
      if (registered) {
        return Object.entries(registered)
      }
     
      
    }
  }

  /*  */
  get(key) {
    return this.#registry.get(key);
  }
}

/*  */
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

  /*  */
  get extension() {
    if (this.#extension === undefined) {
      const file = this.path.split("/").reverse()[0];
      const [stem, ...meta] = file.split(".");
      this.#extension = meta.join(".");
    }
    return this.#extension;
  }

  /*  */
  get format() {
    if (this.#format === undefined) {
      this.#format = this.extension.includes(".")
        ? this.extension.split(".")[0]
        : "";
    }
    return this.#format;
  }

  /*  */
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
        this.#path = `/src/${this.#path.slice(SRC.length)}`
      }



      
    }
    return this.#path;
  }

  /*  */
  get query() {
    if (this.#query === undefined) {
      this.#query = this.#specifier.includes("?")
        ? this.#specifier.split("?").reverse()[0]
        : "";
    }
    return this.#query;
  }

  /*  */
  get type() {
    if (this.#type === undefined) {
      this.#type = this.extension.includes(".")
        ? this.extension.split(".").reverse()[0]
        : this.extension;
    }
    return this.#type;
  }
}

/*  */
class Processors {
  #registry = new Map();

  /*  */
  add(key, processor) {
    this.#registry.set(key, processor);
  }

  /*  */
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