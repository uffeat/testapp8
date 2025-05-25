/*
import "@/rollovite/__init__.js";
import { use } from "@/rollovite/__init__.js";
20250525
v.4.6
*/

/* Do NOT import anything from outside 'rollovite' */
import { assets } from "@/rollovite/_tools/assets.js";
import { Maps } from "@/rollovite/_tools/maps.js";
import { Path } from "@/rollovite/_tools/path.js";
import { Processors } from "@/rollovite/_tools/processors.js";
import { pub } from "@/rollovite/_tools/pub.js";

/* TODO
- Implement '?nocache' option that signals
  - No caching of public assets
  - return copy of src js
  - No caching in processors

- Aliases (exposed), that enables e.g.
  - use.component
- Perhaps sep out a src singleton
- Keep an eye on dir scopes for Vite import maps (globs). 
  Should effectively have global coverage, but leave out dirs and file 
  extensions not used by the actual app. Doing so is verbose, but worth it.
  Such narrowing does of course NOT affect imports from public!
*/

/* Make 'assets' global */
Object.defineProperty(window, "assets", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: assets,
});

/* Make 'use' global */
Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: new Proxy(() => {}, {
    get: (_, key) => app[key],
    apply: (_, __, args) => app.import(...args),
  }),
});

/* Global import utility that supports:
- Truly dynamic imports.
- Import from src ('@/'-prefix) and from public ('/'-prefix).
- Common of file types.
- Raw imports.
- Alternative Python-like-syntax.
- Creation of ad-hoc "importers" that import from base dirs.
- Safe access to registered import maps for reusability. */
const app = new (class {
  #_ = {};

  constructor() {
    const owner = this;

    this.#_.maps = new Maps(this);

    this.#_.processors = new Processors(this);

    /* Enable Python-like import syntax for imports */
    const _factory = (base) =>
      function factory(path) {
        return new Proxy(() => {}, {
          get: (_, part) =>
            path ? factory(path + `/${part}`) : factory(`${base}${part}`),
          apply: (_, __, args) => owner.import(`${path}.${args[0]}`),
        });
      };
    this.#_.public = () => _factory("/")();
    this.#_.src = () => _factory("@/")();
  }

  /* Returns maps controller (unavailable post-freeze). */
  get maps() {
    return this.#_.maps;
  }

  /* Returns processors controller (unavailable post-freeze). */
  get processors() {
    return this.#_.processors;
  }

  /* Returns import from public (subject to any processing) with Python-like 
  syntax. */
  get public() {
    return this.#_.public();
  }

  /* Returns import from src (subject to any processing) with Python-like 
  syntax. */
  get src() {
    return this.#_.src();
  }

  /* Prevents registration of maps and access to processors from API. 
  Chainable. */
  freeze() {
    /* NOTE Safe to expose controlled read access to import maps, but not to 
    processors (risk of cache access). */
    delete this.maps.add;
    delete this.processors;
    return this;
  }

  /* Returns import from src or public, subject to any processing. */
  async import(specifier) {
    const path = new Path(specifier);
    /* Import */
    const result = path.public
      ? await pub.import(path)
      : await this.maps.get(path.key).get(path)();
    /* Process */
    /* NOTE No processing is more likely than processing -> use 'has' 
    initially and not 'get' directly */
    if (this.#_.processors.has(path.key)) {
      const processor = this.#_.processors.get(path.key);
      const processed = await processor.call(path, result);
      if (processed !== undefined) return processed;
    }
    return result;
  }

  /* Returns ad-hoc function that imports from base (with string syntax). */
  importer(base) {
    return async (path) => await this.import(`${base}/${path}`);
  }
})();

/* Add support for most common file types */
app.maps
  .add({
    css: import.meta.glob([
      "/src/**/*.css",
      "!/src/assets/**/*.*",
      "!/src/main/**/*.*",
      "!/src/rollotest/**/*.*",
    ]),
    "css?raw": import.meta.glob(
      [
        "/src/**/*.css",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
    html: import.meta.glob(
      [
        "/src/**/*.html",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
    js: import.meta.glob([
      "/src/**/*.js",
      "!/src/main.js",
      "!/src/assets/**/*.*",
      "!/src/main/**/*.*",
      "!/src/rollotest/**/*.*",
    ]),
    "js?raw": import.meta.glob(
      [
        "/src/**/*.js",
        "!/src/main.js",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
    json: import.meta.glob(
      [
        "/src/**/*.json",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollometa/**/*.*",
        "!/src/rollotest/**/*.*",
      ],
      {
        import: "default",
      }
    ),
    "json?raw": import.meta.glob(
      [
        "/src/**/*.json",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollometa/**/*.*",
        "!/src/rollotest/**/*.*",
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
    svg: import.meta.glob(
      [
        "/src/**/*.svg",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollometa/**/*.*",
        "!/src/rollotest/**/*.*",
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
  })

  /* Add csv support */
  .maps.add({
    csv: import.meta.glob(
      [
        "/src/**/*.csv",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
  })
  .processors.add({
    csv: async (result, { owner }) =>
      (await owner.import("@/rollolibs/papa.js")).Papa.parse(result),
  })

  /* Add md support */
  .maps.add({
    md: import.meta.glob(
      [
        "/src/**/*.md",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
  })
  .processors.add({
    "md?cache": async (result, { owner }) =>
      (await owner.import("@/rollolibs/marked.js")).parse(result).trim(),
  })

  /* Prevent config tampering */
  .freeze();

/* NOTE
Re 'app'
- Central piece of the Rollo import engine. However, not exposed directly,
  but via 'use' (for a more succinct syntax).
- Importers created with 'app.importer' support string syntax only; 
  The benefits of the Python-like syntax are limited, when imports strings 
  are short. 
Re 'use':
- The central piece of the Rollo import engine API.
- Zero-config. Based on in-module defined import maps and processors. This 
  config is not exposed as it is fundamental and should not be 
  tampered with.
- Fast and memory-efficient (imports maps are not copied).
- Import from src or public? Import from src is faster, but also increases 
  bundle size. Moreover, in certain cases, only src import is possible, e.g.,
  when using node modules or Vite-specific features.
  Therefore:
  - Actual app: Import from src, unless dealing with very large file volumes,
    e.g., large number statically generated html files and/or small sizes,
    e.g., icon collections.
  - Testing: Prefer public. Although src .test.js files can be treeshaken out 
    and/or configured as external, it's cleaner to place in public.
  - SSG and other pre-building tasks: Prefer public, but likely that src is
    the only option due to the public import limitations mentioned.
  When serving the app from Vercel the difference between src and public imports 
  is surprisingly small!
- Really no need to export, since added to global namespace, but explicit 
  import can silence barking linters. 
- A slightly better performance could be achieved by refactoring 'use' to be a 
  function that wraps 'app.import' and then do `Object.defineProperty` to 
  patch-on selected members of 'app'. However, the proxy pattern is more 
  elegant and easier to maintain.
Re 'pub':
- Based on the '/'-prefix syntax (Vite-aligned).
- Supports js and all text-based file types.
*/
