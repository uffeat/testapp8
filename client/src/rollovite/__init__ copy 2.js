/*
import "@/rollovite/__init__.js";
20250525
v.5.0
*/

/* Do NOT import anything from outside 'rollovite' */
import { assets } from "@/rollovite/_tools/assets.js";
import { construct } from "@/rollovite/_tools/construct.js";
import { ImportMap } from "@/rollovite/_tools/import_map.js";
import { ImportMaps } from "@/rollovite/_tools/import_maps.js";
import { Path } from "@/rollovite/_tools/path.js";
import { Processor } from "@/rollovite/_tools/processor.js";
import { Processors } from "@/rollovite/_tools/processors.js";
import { pub } from "@/rollovite/_tools/pub.js";

/* TODO
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
- Creation of ad-hoc "importers" that import from base dirs. */
const app = new (class {
  #_ = {};

  constructor() {
    const owner = this;

    this.#_.maps = new ImportMaps(this);
    this.#_.processors = new Processors(this);

    /* Enable Python-like import syntax for imports */
    const _factory = (base) =>
      function factory(path) {
        return new Proxy(() => {}, {
          get: (_, part) =>
            path ? factory(path + `/${part}`) : factory(`${base}${part}`),
          apply: (_, __, args) => {
            const [type, ...rest] = args;
            return owner.import(`${path}.${type}`, ...rest);
          },
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
  async import(specifier, { cache = true, raw = false } = {}) {
    const path = new Path(specifier);
    /* Import */
    const result = path.public
      ? await pub.import(path, { cache, raw })
      : await (async () => {
          /* Handle the special case of uncached js modules */
          if (!path.public && path.type === "js" && cache === false) {
            const text = (await this.maps.get(path, { raw: true })()).trim();
            return await construct(`${text}\n//# sourceURL=${path.file}`);
          }
          return this.maps.get(path, { raw })();
        })();

    /* Process */
    /* NOTE No-processing is more likely than processing -> use 'has' 
    initially and not 'get' directly */
    if (this.#_.processors.has(path.types)) {
      const processor = this.#_.processors.get(path.types);
      const processed = await processor.call(path.path, result, {
        owner: this,
        path,
        cache,
      });
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
  .add(
    new ImportMap(
      import.meta.glob(["/src/**/*.css", "!/src/rollotest/**/*.*"]),
      { type: "css" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.css", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { raw: true, type: "css" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.html", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { type: "html" }
    ),
    new ImportMap(
      import.meta.glob([
        "/src/**/*.js",
        "!/src/main.js",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
      ]),
      { type: "js" }
    ),
    new ImportMap(
      import.meta.glob(
        [
          "/src/**/*.js",
          "!/src/main.js",
          "!/src/main/**/*.*",
          "!/src/rollotest/**/*.*",
        ],
        {
          query: "?raw",
          import: "default",
        }
      ),
      { raw: true, type: "js" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.json", "!/src/rollotest/**/*.*"]),
      { type: "json" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.json", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { raw: true, type: "json" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.svg", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { type: "svg" }
    )
  )

  /* Add csv support */
  .maps.add(
    new ImportMap(
      import.meta.glob(["/src/**/*.csv", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { type: "csv" }
    )
  )
  .processors.add({
    csv: new Processor(
      async (result, { owner, path }) =>
        (await owner.import("@/rollolibs/papa.js")).Papa.parse(result),
      { cache: false }
    ),
  })

  /* Add md support */
  .maps.add(
    new ImportMap(
      import.meta.glob(["/src/**/*.md", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { type: "md" }
    )
  )
  .processors.add({
    md: new Processor(
      async (result, { owner, path }) =>
        (await owner.import("@/rollolibs/marked.js")).parse(result).trim(),
      { cache: true }
    ),
  })

  /* Add yaml support */
  .maps.add(
    new ImportMap(
      import.meta.glob(["/src/**/*.yaml", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { type: "yaml" }
    )
  )
  .processors.add({
    yaml: new Processor(
      async (result, { owner, path }) =>
        (await owner.import("@/rollolibs/yaml.js")).parse(result),
      { cache: false }
    ),
  })

  /* Add support for x.html */
  .processors.add({
    "x.html": new Processor(
      async (result, { owner, path }) => {
        const { author, component } = await owner.import("@/rollocomponent/");
        const { Sheet } = await owner.import("@/rollosheet/");

        const wrapper = component.div({ innerHTML: result });

        const type = wrapper.find(`meta[type]`).getAttribute('type')
        console.log('type:', type)

        if (type === "component") {
          
        }

        /* */
        const main_script = wrapper.find("script[main]");
        if (main_script) {
          /* Global sheets */
          for (const element of wrapper.querySelectorAll("style[global]")) {
            new Sheet(element.textContent).adopt(document);
          }
          const module = await construct(
            `${main_script.textContent}\n//# sourceURL=${path.path}`
          );
          return module;
        } else {
          /* Build assets */
          const assets = {};
          /* Named sheets */
          for (const element of wrapper.querySelectorAll("style[name]")) {
            const name = element.getAttribute("name");
            const sheet = new Sheet(element.textContent, {
              name: `${path.path}/${name}`,
            });
            assets[name] = sheet;
            /* Global sheets */
            if (element.hasAttribute("global")) {
              sheet.adopt(document);
            }
          }
          /* Unnamed global sheets */
          for (const element of wrapper.querySelectorAll(
            "style[global]:not([name])"
          )) {
            new Sheet(element.textContent).adopt(document);
          }

          /* Sheets from src 
        NOTE Injected as classic link-sheets. Not applicable to shadows
        and not included in 'assets'. */
          for (const element of wrapper.querySelectorAll("style[src]")) {
            const src = element.getAttribute("src");
            await owner.import(src);
          }
          /* Templates 
        NOTE Templates can contain (unnamed) styles. These are not sheet-processed. 
        Can be useful for shadow templates.  */
          for (const element of wrapper.querySelectorAll("template")) {
            if (!element.hasAttribute("name")) {
              throw new Error(`Unnamed <template> in ${path.path}`);
            }
            const name = element.getAttribute("name");
            const html = element.innerHTML;
            assets[name] = html;
          }

          /* NOTE Use `component` attr to accommodate future uses of other 
        scripts. Also, (to some degree) guards against collision with 
        vendors' injection of scripts. */
          const script = wrapper.find("script[component]");
          if (script) {
            /* Create module */
            const module = await construct(
              `${script.textContent}\n//# sourceURL=${path.path}`
            );

            /* Get cls */
            const cls = await module.default(assets);
            /* Create instance factory */
            const key = cls.__key__
              ? cls.__key__
              : `rollo-${path.stem.replaceAll("_", "-")}`;
            const factory = author(cls, key);
            if (cls.__factory__) {
              await cls.__factory__(factory);
            }

            return factory;
          } else {
            /* If no script, 'assets' becomes the result. This means that the 
          .x.html format can also be used to only declare sheet and template assets. */
            return Object.freeze(assets);
          }
        }
      },
      {
        cache: true,
      }
    ),
  })

  /* Add support for icon.svg */
  .processors.add({
    "icon.svg": new Processor(
      async (result, { owner, path }) => {
        const { Icon } = await owner.import("@/rollocomponent/");

        return (updates = {}) => {
          return Icon({
            __html__: result,
            __name__: path.stem,
            ...updates,
          });
        };
      },
      {
        cache: true,
      }
    ),
  })

  /* Prevent config tampering */
  .freeze();
