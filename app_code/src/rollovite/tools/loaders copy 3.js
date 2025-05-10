export const LoadersFactory = (parent = class {}) => {
  return class Loaders extends parent {
    static name = "Loaders";

    #registry = new Map();

    constructor(...loaders) {
      super();
      this.add(...loaders);
    }

    /* Returns object, from which a module (or module.default) can be imported 
    with Python-like syntax. */
    get XXXpath() {
      const self = this;
      let path = "@";
      return (function proxy() {
        return new Proxy(
          {},
          {
            get: (target, part) => {
              if (part.includes(":")) {
                //return (options) => self.import((path + part.replaceAll(":", ".")), options)
                return self.import(path + part.replaceAll(":", "."));
              }
              path += `/${part}`;
              return proxy();
            },
          }
        );
      })();
    }

    get path() {
      
     
      return (function factory(path) {
        return new Proxy(this, {
          get: (_, part) => {
            return (part.includes(":")) ? this.import(path + part.replaceAll(":", ".")) : factory.call(this, path + `/${part}`)



            
          },
        });
      }).call(this, "@");
    }

    importer(base) {
      const self = this;

      return new (class {
        get path() {
          return function factory(path) {
            return new Proxy(this, {
              get: (_, part) => {
                if (!path) return factory.call(this, part);
                return part.includes(":")
                  ? this.import(path + part.replaceAll(":", "."))
                  : factory.call(this, path + `/${part}`);
              },
            });
          }.call(this, "");
        }

        import(path) {
          return self.import(`${base}/${path}`);
        }
      })();
    }

    /* Registers loaders. Chainable. */
    add(...loaders) {
      /* NOTE
      - Rather than using Vite's loader objects directly, these are copied into 
        a central registry. While this does involve a copy-step it also guards 
        against duplicate registration and provides initial adaption to the '@/'
        syntax, rather than at each retrieval. */
      loaders.forEach((loader) =>
        Object.entries(loader).forEach(([path, load]) =>
          this.#registry.set(`@/${path.slice("/src/".length)}`, load)
        )
      );
      return this;
    }

    /* Imports and returns array of modules, optionally subject to filter. */
    async batch(filter) {
      const modules = [];
      const paths = this.paths(filter);
      for (const path of paths) {
        const load = this.get(path);
        modules.push(await load());
      }
      return modules;
    }

    /* Removes all loaders. Chainable */
    clear() {
      this.#registry.clear();
      return this;
    }

    /* Imports and returns module or module default. */
    async import(path) {
      const load = this.get(path);
      const module = await load(path);
      if (typeof module === "object" && "default" in module) {
        return module.default;
      }
      return module;
    }

    /* Returns (async) load function. */
    get(path) {
      const load = this.#registry.get(path);
      if (!load) {
        throw new Error(`Invalid path: ${path}`);
      }
      return load;
    }

    /* Checks, if path is in registry. */
    has(path) {
      return this.#registry.has(path);
    }

    /* Returns array of registered paths, optionally subject to filter. */
    paths(filter) {
      const paths = Array.from(this.#registry.keys());
      if (filter) {
        return paths.filter(filter);
      }
      return paths;
    }

    /* Removes and returns load function. */
    pop(path) {
      const load = this.#registry.get(path);
      if (load) {
        this.#registry.delete(path);
        return load;
      }
    }

    /* Removes one or more load functions. */
    remove(...paths) {
      paths.forEach((path) => this.#registry.delete(path));
      return this;
    }

    /* Returns number of registered paths, optionally subject to filter. */
    size(filter) {
      if (filter) {
        return this.paths(filter).length;
      }
      return this.#registry.size;
    }
  };
};

/* Returns instance of Loaders. */
export const Loaders = (...args) => new (LoadersFactory())(...args);
