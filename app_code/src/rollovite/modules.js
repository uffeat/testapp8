/* NOTE Do NOT import modules that uses 'modules' here! */
import { Src } from "@/rollovite/tools/src.js";
import { Processors } from "@/rollovite/tools/processors.js";
import { Public } from "@/rollovite/tools/public/public.js";

/* TODO
- remove and manuel reg
- Perhaps inject meta data into modules
- Build tool for processed imports
*/

/* Import utility that
- builds on Vite's import features with a similar syntax and can be used
  as a drop-in replacement for static and dynamic imports
- adds platform-native features (e.g., truly native dynamic imports)
- supports import of /src as well as /public files (regardless of environment)
- can be configured 
  - for fine-grained import source control
  - to support native and synthetic files types
  - to post-process imports (hook-like mechanism)
XXX
- Changes to code that uses 'modules' are NOT picked up by Vite's HMR, i.e., 
  a manual browser refresh is required for Vite's dev server to pick up the 
  changes (restart of the dev server is NOT required).
- Usage of 'modules' requires that all mapped files use imports with extensions,
  i.e., cannot leave out '.js'. */
class Modules {
  #src;
  #processors;
  #public
  

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
    const options = {};
    const modules = this;
    const terminators = ["css", "html", "js", "json"];
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
          /* Handle termination */
          if (terminators.includes(part)) {
            const terminator = ({ format, raw = false } = {}) => {
              /* NOTE
              - 'raw' is provided as an object item with a Boolean value to 
                minimize the use of strings. 
              - 'format' (secondary file type) is provided as an object item 
                with a string value - difficult to avoid string, since possible 
                values of 'format' are not known a priori (NOT critical!). */
              if (format) {
                options.format = format;
              }
              if (raw) {
                options.raw = raw;
              }
              path += `.${part}`;
              return modules.get(path, options);
            };
            return terminator;
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
  );

