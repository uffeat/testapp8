/*
rollovite/modules.js
20250508
*/

/* NOTE Do NOT import modules that uses 'modules' here! */
export const modules = new (class Modules {
  #cache = {};
  #loaders = import.meta.glob(["/src/**/*.js", "!/src/**/*.test.js"]);
  constructor() {}

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

  /* Returns import result. */
  async get(path) {
    let module;
    if (path.startsWith("/")) {
      /* Import module from /public */
      path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
      if (path in this.#cache) {
        module = this.#cache[path];
      } else {
        module = await create_module(path);
        this.#cache[path] = module;
      }
    } else {
      /* Import module from /src */
      path = `/src/${path.slice("@/".length)}`;
      const load = this.#loaders[path];
      if (!load) {
        throw new Error(`Invalid path: ${path}`);
      }
      module = await load();
    }
    if ("default" in module) {
      return module.default;
    }
    return module;
  }
})();

/* Make modules global */
Object.defineProperty(window, "modules", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: modules,
});

/* Returns module created from text. 
NOTE
- Does NOT cache module. */
async function create_module(path) {
  const response = await fetch(path);
  const text = (await response.text()).trim();
  const blob = new Blob([text], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  /* Access 'import' from constructed function to prevent Vite from barking 
  at dynamic import */
  const module = await Function(`return import("${url}")`)();
  URL.revokeObjectURL(url);
  return module;
}
