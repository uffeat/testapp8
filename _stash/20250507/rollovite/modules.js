/*
rollovite/modules.js
20250507
*/

/* NOTE Do NOT import modules that uses 'modules' here! */

import { Src } from "@/rollovite/tools/src.js";
import { Processors } from "@/rollovite/tools/processors.js";
import { Public } from "@/rollovite/tools/public/public.js";

/* TODO
- 
*/

/* Import utility.
NOTE
- Builds on Vite's import features with a similar syntax and can be used
  as a drop-in replacement for static and dynamic imports.
- Adds platform-native features (e.g., truly dynamic imports).
- Supports import of /src as well as /public files (regardless of environment).
  Files can therefore live in either '/src' or '/public' and be handled with almost 
  the same syntax. This can be used to adjust the trade-off between bundle size and 
  import performance.
- Can be configured 
  - to support native and non-native files types
  - to post-process imports (hook-like mechanism) based on file extension
- Changes to code that uses 'modules' are NOT picked up by Vite's HMR, i.e., 
  a manual browser refresh is required for Vite's dev server to pick up the 
  changes (restart of the dev server is NOT required).
- Usage of 'modules' requires that all mapped files use imports with extensions,
  i.e., cannot leave out '.js'. */
class Modules {
  /* XXX Less-than-ideal stuff and things to be aware of...
  - The syntax for registering loaders ('modules.src.add') is not super elegant,
    in part, because Vite's syntax for 
  - The 'raw' kwarg of 'modules.get' is not universally applicable, i.e., in certain 
    cases ignored or overwritten.
  - Loaders (Vite import maps) are registered in a single registry. This prevents 
    dublicate loaders, but introduces a copy-step from Vite native loaders and 
    does not catch redundant overwrites.
  - The Python-like syntax (modules.import) works well, but its syntax for 
    dealing with "composite file types" is not elegant. 
  - Working with files in '/public' is in many ways more straight-forward than 
    working with files '/src', since no explicit 'add' step is required, and files
    in '/public' do not affect bundle size. However, 
    - if files in '/public' refs files in '/src', the src files must be registered 
      with 'modules.src.add' 
    - to use batch-import for files on '/public', a pre-builder must be run
    - importing files in '/public' is slower than importing files in '/src'
    - while no impact on bundle size, importing files in '/public' does gradually
      build up memory due to manuel caching.
    - In order to benefit from the features of 'modules' (with respect to src as 
      well as public files), 'modules' does not necessarily have to be used directly.
      Instead, the patterns established in 'modules' (and it constituents) could be
      applied for provision of leaner and more specialized features.
    */

  #config;
  #src;
  #processors;
  #public;

  constructor() {
    this.#config = new (class Config {
      #types;
      constructor() {
        this.#types = new (class Types {
          #registry = new Set();

          /* Return supported types.
          NOTE
          - Since an unfrozen registry could be mutated with unpredicatable 
            consequences, access to registry is only allowed once frozen. */
          get types() {
            if (!Object.isFrozen(this.#registry)) {
              throw new Error(`Cannot access unfrozen.`);
            }
            return this.#registry;
          }

          /* Add one or more supported types. Chainable. */
          add(...types) {
            if (Object.isFrozen(this.#registry)) {
              throw new Error(`Frozen.`);
            }
            types.forEach((type) => this.#registry.add(type));
            return this;
          }

          /* Freezes registry. Chainable.
          NOTE
          - Call when all types has been registered. */
          freeze() {
            if (Object.isFrozen(this.#registry)) {
              throw new Error(`Already frozen.`);
            }
            this.#registry = Object.freeze(this.#registry);
            return this;
          }
        })();
      }

      get types() {
        return this.#types;
      }
    })();
    this.#src = new Src(this);
    this.#processors = new Processors();
    this.#public = new Public();
  }

  /* Returns config utility. */
  get config() {
    return this.#config;
  }

  /* Returns import result. 
  NOTE
  - Syntactial Python-like alternative to 'get'. 
  - Does NOT support relative imports. */
  get import() {
    let path;
    const modules = this;
    const terminators = modules.config.types.types;
    /* Builds up path by successive recursive calls until terminsation cue. */
    const proxy = () =>
      new Proxy(this, {
        get: (target, part) => {
          /* Handle source */
          if (path === undefined) {
            if (part === "src") {
              path = "@";
            } else if (part === "public") {
              path = "";
            } else {
              throw new Error(`Invalid source`);
            }
            return proxy();
          }
          /* Handle termination for simple file types */
          if (terminators.has(part)) {
            path += `.${part}`;
            return (options = {}) => modules.get(path, options);
          }
          /* Handle termination for composite file types */
          if (part.includes(":")) {
            path += `.${part.replaceAll(":", ".")}`;
            return (options = {}) => modules.get(path, options);
          }
          /* Handle dir path */
          path += `/${part}`;
          return proxy();
        },
      });
    return proxy();
  }

  /* Returns controller for src files. */
  get src() {
    return this.#src;
  }

  /* Returns controller for processors. */
  get processors() {
    return this.#processors;
  }

  /* Returns controller for public files. */
  get public() {
    return this.#public;
  }

  /* Returns import result. */
  async get(path, { raw = false } = {}) {
    let result;
    if (path.startsWith("/")) {
      /* Import from file from /public */
      result = await this.public.get(path, { raw });
      if (!result) {
        return;
      }
    } else {
      /* Import from file from /src */
      result = await this.src.get(path, { raw });
    }
    /* Perform any processing and return result */
    const extension = get_extension(path);
    const processor = this.processors.get(extension);
    if (processor) {
      return await processor.call(this, path, result, {
        owner: this,
        raw,
      });
    } else {
      return result;
    }
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

/* Returns file extensions from path. */
function get_extension(path) {
  const file = path.split("/").reverse()[0];
  const [stem, ...meta] = file.split(".");
  return meta.join(".");
}

/* Configure */

/* NOTE
- Vercel sometimes injects scripts into html imported from '/public'.
  To prevent this, 'template'-type html files (with html file association)
  should be used. */
modules.config.types.add("css", "html", "js", "json", "template").freeze();

/* Ensure that html- and template-type files in '/src' are always imported as 'raw'
in agreement with import of such '/public' files */
modules.src.config.raw.add("html", "template").freeze();

/* Ensure that json files can be imported from '/src' without the need to 
access 'default' in agreement with import of such '/public' files. */
modules.src.config.import.add({ json: "default" }).freeze();
