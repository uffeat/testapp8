/* NOTE Do NOT import modules that uses 'modules' here! */
import { module } from "@/rollo/tools/module.js";

const PUBLIC = "/";
const SRC = "@/";

/* TODO
- Version of 'modules' in external code (e.g., code in /public), so that 
  html-files in external sources can be run directly (LiveServer) and use 
  files from
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
  NOTE
  - Typically used with Vite's import.meta.glob, but can also be used for 
    - manually-created module loaders
    - "virtual module loaders". */
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
      /* Import from files in /public */
      if (path.path in this.#cache) {
        return this.#cache[path.path];
      }
      if (path.type === "js" && !path.query) {
        result = await this.#import(path.path);
      } else {
        const response = await fetch(path);
        result = (await response.text()).trim();
      }
      this.#cache[path.path] = result;
    } else {
      /* Import from files in /src */
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

  #import(url) {
    return new Function(`return import("${url}")`)();
  }
}

/* Utils... */

/* Util for managing loaders.  */
class Loaders {
  #frozen = new Set();
  #registry = new Map();

  /* Registers one or more loaders. Chainable.
  NOTE
  - Multiple loaders can be added in one-go (without the need to destructure 
    into a single object).
  - Multiple loaders for multiple keys can be added in one-go.
  - Method can be called multiple times without clearing registry. */
  add(spec) {
    for (const [key, loaders] of Object.entries(spec)) {
      /* */
      if (this.#frozen.has(key)) {
        throw new Error(`The key '${key}' has been frozen.`);
      }
      let registered = this.#registry.get(key);
      if (!registered) {
        registered = {};
        this.#registry.set(key, registered);
      }

      if (Array.isArray(loaders)) {
        loaders.forEach((loaders) => Object.assign(registered, loaders));
      } else {
        Object.assign(registered, loaders);
      }
    }
    return this;
  }

  /* Registers and freezes one or more loaders. Chainable. 
  NOTE
  - A leaner and safer, but less flexible alternative to 'add'.
    - Leaner because loaders are not copied, but stored directly.
    - Safer, but less flexible because subsequent change attempts 
      will throw an error.
  - Use (instead of 'add'), when global reliability and consistency 
    with respect to conventions are critical. */
  define(spec) {
    for (const [key, loaders] of Object.entries(spec)) {
      if (this.#frozen.has(key)) {
        throw new Error(`The key '${key}' has been frozen`);
      }
      this.#registry.set(key, loaders);
      this.#frozen.add(key);
    }
    return this;
  }

  /* Prevents future registration for one or more keys. Chainable. */
  freeze(...keys) {
    keys.forEach((key) => this.#frozen.add(key));
    return this;
  }

  /* Returns loaders as entries for a given key.
  Returns an amalgamation of all loaders as entries, if no key.
  NOTE
  - Primarily for debugging. */
  entries(key) {
    if (key) {
      const registered = this.#registry.get(key);
      if (registered) {
        return Object.entries(registered);
      }
    } else {
      return Array.from(this.#registry.values(), (registered) =>
        Object.entries(registered)
      );
    }
  }

  /* Prevents future registration for one or more keys. Chainable. */
  freeze(...keys) {
    keys.forEach((key) => this.#frozen.add(key));
    return this;
  }

  /* Returns loader by key. */
  get(key) {
    if (key) {
      return this.#registry.get(key);
    }
    const result = {};
    for (const registered of this.#registry.values()) {
      for (const [path, load] of Object.entries(registered)) {
        result[path] = load;
      }
    }
    return Object.freeze(result);
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

  /* Returns number of load functions registered for a given key.
  Returns total number of registered load functions, if no key is provided.
  NOTE
  - Primarily for debugging. */
  size(key) {
    if (key) {
      const registered = this.#registry.get(key);
      if (registered) {
        return Object.keys(registered).length;
      }
    } else {
      let result = 0;
      this.#registry
        .values()
        .forEach((registered) => (result += Object.keys(registered).length));
      return result;
    }
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
  #frozen = new Set();
  #registry = new Map();

  /* Adds one or more processors. Chainable. 
  NOTE
  - Processors for multiple keys can be added in one-go. */
  add(spec) {
    Object.entries(spec).forEach(([key, processor]) => {
      if (this.#frozen.has(key)) {
        throw new Error(`The key '${key}' has been frozen`);
      }
      this.#registry.set(key, processor);
    });
    return this;
  }

  /* Returns registered processors as entries.
  NOTE
  - Primarily for debugging. */
  entries() {
    return this.#registry.entries();
  }

  /* Prevents future registration for one or more keys. Chainable. */
  freeze(...keys) {
    keys.forEach((key) => this.#frozen.add(key));
    return this;
  }

  /* Returns processor by key. */
  get(key) {
    return this.#registry.get(key);
  }

  /* Checks, if a processor with a given key has been registered. */
  has(key) {
    return this.#registry.has(key);
  }

  /* Returns number of processors registered.
  NOTE
  - Primarily for debugging. */
  size() {
    /* NOTE
    - Implemented as method for consistency with respect to Loaders */
    return this.#registry.size;
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

/* Define production-relevant universal loaders 
NOTE
- Excludes files in src/main/development.
- To keep lean and idiomatic, does NOT include files with secondary file 
  type, except for css imports (to support .module.css). Such special formats 
  should be handled decentralized and perhaps env-dependent. */
modules.loaders.define({
  /* Vite-native import of css, incl. css as text */
  css: import.meta.glob(["/src/**/*.css", "!/src/main/development/**/*.*"]),
  "css?raw": import.meta.glob(
    ["/src/**/*.css", "!/src/**/*.*.*", "!/src/main/development/**/*.*"],
    {
      import: "default",
      query: "?raw",
    }
  ),
  /* Import of html as text */
  html: import.meta.glob(
    ["/src/**/*.html", "!/src/**/*.*.*", "!/src/main/development/**/*.*"],
    {
      import: "default",
      query: "?raw",
    }
  ),
  /* Vite-native import of js as module and text */
  js: import.meta.glob([
    "/src/**/*.js",
    "!/src/**/*.*.*",
    "!/src/main/development/**/*.*",
  ]),
  "js?raw": import.meta.glob(
    ["/src/**/*.js", "!/src/**/*.*.*", "!/src/main/development/**/*.*"],
    { import: "default", query: "?raw" }
  ),
  /* Vite-native json import */
  json: import.meta.glob([
    "/src/**/*.json",
    "!/src/**/*.*.*",
    "!/src/main/development/**/*.*",
  ]),
});

/* Test (purge) */
/* false */

console.log(modules.loaders.has("html", "@/test/foo/foo.js.html"));
console.log(
  modules.loaders.has("js", "@/main/development/tests/modules/foo.test.js")
);
console.log(
  modules.loaders.has("js?raw", "@/main/development/tests/modules/foo.test.js")
);
console.log(modules.loaders.has("js", "@/test/foo/foo.foo.js"));
console.log(modules.loaders.has("json", "@/test/foo/foo.foo.json"));

console.log("true...");
/* true */



console.log(modules.loaders.has("css", "@/test/foo/foo.css"));
console.log(modules.loaders.has("css", "@/test/foo/foo.module.css"));
console.log(modules.loaders.has("css?raw", "@/test/foo/foo.css"));
console.log(modules.loaders.has("html", "@/test/foo/foo.html"));
console.log(modules.loaders.has("js", "@/test/foo/foo.js"));
console.log(modules.loaders.has("js?raw", "@/test/foo/foo.js"));
console.log(modules.loaders.has("json", "@/test/foo/foo.json"));
