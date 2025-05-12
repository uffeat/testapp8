/*
rollovite/tools/loaders.js
20250510
v.1.1
*/

import { factory } from "@/rollovite/tools/factory.js";

/* Returns Loaders class, optionally extended from parent. */
export const LoadersFactory = (parent = class {}) => {
  return class Loaders extends parent {
    static name = "Loaders";

    #factory = factory.call(this, "@");
    #frozen = false;
    #importer;
    #paths;
    #registry = new Map();

    constructor() {
      super();

      const owner = this;
      this.#importer = new (class Importer {
        create(base) {
          return new (class {
            #factory = factory.call(this);

            /* Imports and returns module or module default with Python-like syntax. */
            get path() {
              return this.#factory;
            }

            /* Imports and returns module or module default. */
            import(path, ...args) {
              return owner.import(`${base}/${path}`, ...args);
            }
          })();
        }
      })();
    }

    get frozen() {
      return this.#frozen;
    }

    /* Returns object, from which modules (or module members) can be imported 
    from a given base dir with string-based or Python-like syntax. 
    Enables shorter import statements. */
    get importer() {
      return this.#importer;
    }

    /* Imports and returns module or module member with Python-like syntax. */
    get path() {
      return this.#factory;
    }

    /* Registers loaders. Chainable. 
    NOTE
    - 'loaders' should typically be provided as objects returned by Vite's 
      'import.meta.glob' function, but can be provided as other objects with 
       similar shape, e.g.:
         { 'my_path': () => import(my_path) }
    - The 'raw' option should be set, if raw imports are needed for file types
      that Vite does not natively import as raw, including css, js and json.
      In 'import.meta.glob' the { query: "?raw" } option should be used 
      (without the 'add' {raw: true } option ) for file types that Vite's does 
      not natively support, e.g. html. These rules are funky and are best 
      illustrated by example;  see relevant test files. */
    add({ raw = false }, ...loaders) {
      /* NOTE
      - Rather than using loader objects directly, these are copied into 
        a central registry. While this does involve a copy-step it also guards
        against duplicate registration and provides initial path adaptation, 
        rather than at each retrieval. */
      loaders.forEach((loader) =>
        Object.entries(loader).forEach(([path, load]) => {
          /* NOTE
          - Objects created with 'import.meta.glob' and options (e.g., 
            { query: "?raw" }) do NOT carry these options into the path key.   
            To avoid registry overwrites, 'add' options are serialized
            and appended to the applied key. 'add' only supports a 'raw' option
            and this option is (sensibly) added to the path key by brute 
            force. */
          const key = `@/${(raw ? path + "?raw" : path).slice("/src/".length)}`;
          if (this.#registry.has(key)) {
            console.warn(`Overwriting key: ${key}`);
          }
          this.#registry.set(key, load);
        })
      );
      return this;
    }

    /* Imports and returns array of modules, optionally subject to filter. 
    NOTE
    - Primarily intended for side-effect imports, but does provide return. */
    async batch(filter) {
      const modules = [];
      for (const path of this.paths(filter)) {
        modules.push(await this.get(path)());
      }
      return modules;
    }

    /* Removes all loaders. Chainable 
    NOTE
    -  Cannot be used post-freeze. */
    clear() {
      this.#registry.clear();
      return this;
    }

    /* Returns object copy of registry.
    NOTE
    - Intended for debugging and special cases. */
    copy() {
      return Object.fromEntries(this.#registry.entries());
    }

    /* Prevents subsequent registry changes. Chainable. 
    NOTE
    - Also sets the 'frozen' flag, which can be used by other members to 
      optimize performance. */
    freeze() {
      if (this.frozen) {
        throw new Error(`Frozen.`);
      }
      this.#frozen = true;
      /* Replace methods that can change registry with chainable methods 
      that logs an error */
      const factory = (key) => () => {
        console.warn(`'${key}' cannot be used post-freeze.`);
        return this;
      };
      const keys = ["add", "clear", "pop", "remove"];
      keys.forEach((key) => {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: factory(key),
        });
      });
      return this;
    }

    /* Returns (async) load function. */
    get(path) {
      return this.#registry.get(path);
    }

    /* Checks, if path is in registry. */
    has(path) {
      return this.#registry.has(path);
    }

    /* Imports module and returns module or module member.
    If path is invalid, an (unthrown) Error instance with the path as its message
    is returned. */
    async import(path, { name, raw } = {}) {
      /* XXX
      - Depending on config and file type, import options ('name' and 'raw') 
        could be ignored or result in error-return, e.g.:
        - Use of 'raw' for types that already import as raw (natively or 
          by config) will return an error.
        - Attempts to use 'name' for raw imports will silently be ignored.
        These issues are not critical, but usage does require a level of
        reasonable discipline.
      */
      if (raw && !path.endsWith("?raw")) {
        path += "?raw";
      }

      const load = this.get(path);
      if (load) {
        const module = await load();
        if ("default" in module) {
          /* NOTE
          - Convention: Modules with default export, should not export 
            anything else. */
          if (name && typeof module.default === "object") {
            return module.default[name];
          }
          return module.default;
        }
        if (name) {
          return module[name];
        }
        return module;
      }
      return new Error(path);
    }

    /* Returns array of registered paths, optionally subject to filter. */
    paths(filter) {
      /* If frozen, paths do not need to be created at each call */
      if (!this.#paths && this.frozen) {
        this.#paths = Array.from(this.#registry.keys());
      }
      const paths = this.#paths || Array.from(this.#registry.keys());
      return filter ? paths.filter(filter) : paths;
    }

    /* Removes and returns load function (if registered).
    NOTE
    - Cannot be used post-freeze. */
    pop(path) {
      const load = this.#registry.get(path);
      if (load) {
        this.#registry.delete(path);
        return load;
      }
    }

    /* Removes one or more load functions. Chainable.
    NOTE
    -  Cannot be used post-freeze. */
    remove(...paths) {
      paths.forEach((path) => this.#registry.delete(path));
      return this;
    }

    /* Returns number of registered paths, optionally subject to filter. */
    size(filter) {
      return filter ? this.paths(filter).length : this.#registry.size;
    }
  };
};

/* Returns instance of Loaders, a utility for importing src files as per file 
type or as text (raw). 
NOTE
- Enables truly dynamic imports.
- Supports batch imports.
- Requires pre-use config with 'add'.
- Uses the '@/' syntax.
- Support 'importers' to enable shorter import statements for imports from a 
  given base dir. 
- Supports an alternative Python-like syntax, incl. for importers.
 */
export const Loaders = (...args) => new (LoadersFactory())(...args);

/* Example of Loaders instance with general-purpose configuration for @/test scope. 
NOTE
- Does not return anything; ONLY provided as "in-module" temp demo code, to be removed o
nce transferred to formal tests. */
const example = async () => {
  const loaders = Loaders()
    .add(
      {},
      import.meta.glob("/src/test/**/*.css"),
      import.meta.glob("/src/test/**/*.html", { query: "?raw" }),
      import.meta.glob(["/src/test/**/*.js", "!/src/test/**/*.test.js"]),
      import.meta.glob("/src/test/**/*.json")
    )
    .add(
      { raw: true },
      import.meta.glob("/src/test/**/*.css", { query: "?raw" }),
      import.meta.glob("/src/test/**/*.js", { query: "?raw" }),
      import.meta.glob("/src/test/**/*.json", { query: "?raw" })
    )
    .freeze();

  /* Usage */

  await (async function js() {
    /* Import named member of js module */
    console.log("foo:", (await loaders.import("@/test/foo/foo.js")).foo);
    console.log(
      "foo:",
      await loaders.import("@/test/foo/foo.js", { name: "foo" })
    );
    console.log(
      "foo:",
      await loaders.path.test.foo.foo[":js"]({ name: "foo" })
    );
    console.log("raw:", await loaders.import("@/test/foo/foo.js?raw"));
    // Alternatively:
    console.log(
      "raw:",
      await loaders.import("@/test/foo/foo.js", { raw: true })
    );
    console.log("raw:", await loaders.path.test.foo.foo[":js"]({ raw: true }));
  })();

  await (async function json() {
    console.log("parsed:", await loaders.import("@/test/foo/foo.json"));
    console.log("parsed:", await loaders.import("@/test/bar/bar.json"));
    console.log(
      "raw:",
      await loaders.import("@/test/foo/foo.json", { raw: true })
    );
    console.log(
      "raw:",
      await loaders.path.test.foo.foo[":json"]({ raw: true })
    );
    console.log("foo:", (await loaders.import("@/test/foo/foo.json")).foo);
    console.log(
      "foo:",
      await loaders.import("@/test/foo/foo.json", { name: "foo" })
    );
    console.log(
      "foo:",
      await loaders.path.test.foo.foo[":json"]({ name: "foo" })
    );
  })();

  await (async function html() {
    console.log("html:", await loaders.import("@/test/foo/foo.html"));
    console.log("html:", await await loaders.path.test.foo.foo[":html"]());
  })();

  await (async function css() {
    console.log(
      "raw:",
      await loaders.import("@/test/foo/foo.css", { raw: true })
    );
    console.log("raw:", await loaders.path.test.foo.foo[":css"]({ raw: true }));
  })();

  await (async function batch() {
    await loaders.batch((path) => path.includes("/batch/"));
  })();

  (function paths() {
    console.log(
      "paths:",
      loaders.paths((path) => path.includes("bar"))
    );
  })();

  (function size() {
    console.log("size:", loaders.size());
  })();

  await (async function importer() {
    const test = loaders.importer.create("@/test");
    console.log("foo:", await test.import("foo/foo.js", { name: "foo" }));
    console.log("foo:", (await test.path.foo.foo[":js"]()).foo);
  })();

  /* Anti-patterns */
  await (async function anti() {
    /* Will still import raw:*/
    console.log(
      "raw:",
      await loaders.import("@/test/foo/foo.js", { name: "foo", raw: true })
    );

    /* Returns an error: */
    console.log(
      "html:",
      await loaders.import("@/test/foo/foo.html", { raw: true })
    );
  })();
};
