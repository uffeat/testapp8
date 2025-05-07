/* NOTE Do NOT import modules that uses 'modules' here! */
import { Src } from "@/rollovite/tools/src.js";
import { Processors } from "@/rollovite/tools/processors.js";
import { Public } from "@/rollovite/tools/public/public.js";

/* TODO
- Fix misalignment between importing json from /src and /public:
  
*/

/* Import utility.
NOTE
- Builds on Vite's import features with a similar syntax and can be used
  as a drop-in replacement for static and dynamic imports.
- Adds platform-native features (e.g., truly dynamic imports).
- Supports import of /src as well as /public files (regardless of environment).
  Files can therefore (almost) without friction live in either /src or /public.
  This can be used to adjust the trade-off between bundle size and import performance.
- Can be configured 
  - to support native and synthetic files types
  - to post-process imports (hook-like mechanism)
- Changes to code that uses 'modules' are NOT picked up by Vite's HMR, i.e., 
  a manual browser refresh is required for Vite's dev server to pick up the 
  changes (restart of the dev server is NOT required).
- Usage of 'modules' requires that all mapped files use imports with extensions,
  i.e., cannot leave out '.js'. */
class Modules {

  /* XXX
  - The syntax for registering loaders (modules.src.add) is not super elegant.
  - The kwargs of modules.get are not universally applicable, i.e., in certain 
    cases ignored or overwritten.
  - Loaders are registered in a single registry. This prevents dublicate loaders, 
    but introduces a copy-step from Vite native loaders and does not catch unintended overwrites.
  - The Python-like syntax (modules.import) works well, but its syntax for dealing with 
    "composite file types" is not elegant. */
  #src;
  #processors;
  #public;

  constructor() {
    this.#src = new Src();
    this.#processors = new Processors();
    this.#public = new Public();
  }

  /* Returns import result. 
  NOTE
  - Syntactial Python-like alternative to 'get'. 
  - Does NOT support relative imports. */
  get import() {
    let path;

    const modules = this;
    /* NOTE
    -  */
    const terminators = ["css", "html", "js", "json", "template"];

    /* */
    const get_proxy = () =>
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
            return get_proxy();
          }
          /* Handle termination for simple file types */
          if (terminators.includes(part)) {
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
          return get_proxy();
        },
      });
    return get_proxy();
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
  async get(path, { format, raw = false } = {}) {
    let result;
    if (path.startsWith("/")) {
      /* Import from files in /public */
      result = await this.#public.get(path, { raw });
      if (!result) {
        return;
      }
    } else {
      /* Import from files in /src */
      result = await this.#src.get(path, { raw });
    }

    /* Perform any processing and return result */
    const processor = this.#processors.get(format);
    if (processor) {
      return await processor.call(this, path, result, {
        owner: this,
        format,
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

/* Define production-relevant universal loaders 
NOTE
- Excludes files in src/main/development.
- To keep lean and idiomatic, does NOT include files with secondary file 
  type, except for css imports (to support .module.css). Such special formats 
  should be handled decentralized and perhaps env-dependent. */
modules.src
  /* Vite-native import of css, incl. css as text */
  .add(import.meta.glob(["/src/**/*.css", "!/src/main/development/**/*.*"]))
  .add(
    import.meta.glob(
      ["/src/**/*.css", "!/src/**/*.*.*", "!/src/main/development/**/*.*"],
      {
        import: "default",
        query: "?raw",
      }
    ),
    { raw: true }
  )
  /* Import of html as text */
  .add(
    import.meta.glob(
      ["/src/**/*.html", "!/src/**/*.*.*", "!/src/main/development/**/*.*"],
      {
        import: "default",
        query: "?raw",
      }
    ),
    { raw: "html" }
  )
  /* Vite-native import of js as module and text */
  .add(
    import.meta.glob([
      "/src/**/*.js",
      "!/src/**/*.*.*",
      "!/src/main/development/**/*.*",
    ])
  )
  .add(
    import.meta.glob(
      ["/src/**/*.js", "!/src/**/*.*.*", "!/src/main/development/**/*.*"],
      { import: "default", query: "?raw" }
    ),
    { raw: true }
  )
  /* Vite-native json import */
  .add(
    import.meta.glob([
      "/src/**/*.json",
      "!/src/**/*.*.*",
      "!/src/main/development/**/*.*",
    ])
  )
  /* Import of template as text */
  .add(
    import.meta.glob(
      ["/src/**/*.template", "!/src/**/*.*.*", "!/src/main/development/**/*.*"],
      {
        import: "default",
        query: "?raw",
      }
    ),
    { raw: "template" }
  );
