/* NOTE Do NOT import modules here that uses 'modules' */
/* TODO
- Integrate instead of import */
import { import_, text_to_module } from "@/tools/module.js";

/* TODO
- version of modules for static (in public)
- test json
- test non-vite loaders 
- Python-like dot-syntax (optional) 
- Build tool for processed imports */

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
      this.#specifier = import.meta.env.DEV ? path : `/_/theme/public${path}`;
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

    const extension = `${format}.${type}`;

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
      const key = query ? `${type}?${query}` : type;

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

/* Set up support for Vite-native css import */
modules.loaders.add("css", import.meta.glob("/src/rollo/**/*.css"));

/* Set up support for import of css as text */
modules.loaders.add(
  "css?raw",
  import.meta.glob("/src/**/*.css", {
    import: "default",
    query: "?raw",
  })
);

/* Set up support for import of html as text */
modules.loaders.add(
  "html",
  import.meta.glob("/src/**/*.html", {
    import: "default",
    query: "?raw",
  })
);

/* Set up support for Vite-native js module import */
modules.loaders.add("js", import.meta.glob("/src/**/*.js"));

/* Set up support for Vite-native json import */
modules.loaders.add("json", import.meta.glob("/src/**/*.json"));

/* Set up support for import of js modules as text */
modules.loaders.add(
  "js?raw",
  import.meta.glob("/src/**/*.js", {
    import: "default",
    query: "?raw",
  })
);

/* */
(() => {
  const cache = {};
  modules.processors.add("js.html", async (path, html) => {
    if (path in cache) {
      return cache[path];
    }
    const element = document.createElement("div");
    element.innerHTML = html;

    const result = await text_to_module(
      element
        .querySelector("template[script]")
        .content.querySelector("script")
        .textContent.trim()
    );
    cache[path] = result;
    return result;
  });
})();


//
//
console.log('css:', await modules.get("@/rollo/foo/foo.css?raw"))////
console.log((await modules.get("@/rollo/tools/text/case.js")).camel_to_kebab('uffeArlo'))////
console.log('text:', await modules.get("@/rollo/tools/text/case.js?raw"))////
console.log('html:', await modules.get("@/rollo/foo/foo.html"))////
console.log('foo:', (await modules.get("@/rollo/foo/foo.js.html")).foo)////
console.log("public foo:", (await modules.get("/foo.js")).foo); ////
console.log("public html:", await modules.get("/foo.html")); ////
