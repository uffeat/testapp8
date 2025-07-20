/*
import { Use } from "@/rollouse/use.js";
*/
import { Assets } from "./tools/assets.js";
import { Imports } from "./tools/imports.js";
import { Path } from "./tools/path.js";
import { Processors } from "./tools/processors.js";
import { Signatures } from "./tools/signatures.js";
import { TypeHooks } from "./tools/type_hooks.js";
import { pub } from "./tools/pub.js";

import { construct } from "./tools/construct.js";
import { Processor } from "./tools/processor.js";

//import { AnvilLoaders } from "@/rolloanvil/main.js";///

export const Use = new (class {
  #_ = {};

  constructor() {
    this.#_.imports = new Imports(this);
    this.#_.processors = new Processors(this);
    this.#_.signatures = new Signatures(this);
    
    this.#_.typeHooks = new TypeHooks(this);
  }

  /* Returns imports controller. */
  get imports() {
    return this.#_.imports;
  }

  /* Returns processors controller. */
  get processors() {
    return this.#_.processors;
  }

  /* Returns signatures controller. */
  get signatures() {
    return this.#_.signatures;
  }

  /* Returns typeHooks controller. */
  get typeHooks() {
    return this.#_.typeHooks;
  }

  async module(specifier, options = {}) {
    const path = new Path(specifier);

    /* Type hooks */
    if (this.typeHooks.has(path.type)) {
      const loader = this.typeHooks.get(path.type);
      return await loader(specifier);
    }

    /* Signature */
    if (this.signatures.has(path.types)) {
      const handler = this.signatures.get(path.types);
      await handler(options, { owner: this, path });
    }
    const { cache = true, raw = false } = options;

    /* Import */
    const result = path.public
      ? await pub.import(path, { cache, raw })
      : await this.imports.import(path, { raw });

    /* Process */
    if (this.processors.has(path.types)) {
      const processor = this.processors.get(path.types);
      const processed = await processor.call(path.path, result, {
        owner: this,
        path,
        cache,
      });
      if (processed !== undefined) return processed;
    }

    return result;
  }
})();

/* Add 'use' to global namespace */
Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: new Proxy(() => {}, {
    get: (_, key) => Use[key],
    apply: (_, __, args) => Use.module(...args),
  }),
});

/* Add capability to import selected JS modules from src. */
Use.imports.add(
  import.meta.glob([
    "/src/main.js",
    "/src/meta.js",
    "/src/rolloanvil/rolloanvil.js",
    "/src/rolloapp/rolloapp.js",
    "/src/rollocomponent/rollocomponent.js",
    "/src/rollolibs/bootstrap/bootstrap.js",
    "/src/rollolibs/yaml/yaml.js",
    "/src/rollolibs/marked.js",
    "/src/rollolibs/papa.js",
    "/src/rollosheet/rollosheet.js",
    "/src/rollostate/rollostate.js",
    "/src/rollotest/rollotest.js",
    "/src/rollotools/**/*.js",
  ])
);
/* Add capability to import CSS modules from src */
Use.imports.add(import.meta.glob(["/src/**/*.css", "!/src/main.css"]));

/* Add capability to import raw CSS modules from src */
Use.imports.add(
  import.meta.glob(["/src/**/*.css"], {
    query: "?raw",
    import: "default",
  }),
  { raw: true }
);

/* Add capability to import raw HTML modules from src */
Use.imports.add(
  import.meta.glob(["/src/**/*.html"], {
    query: "?raw",
    import: "default",
  }),
  { raw: true }
);

//Use.typeHooks.add({ py: (specifier) => AnvilLoaders.create(specifier) });//

/* Add '.sheet.css' processor */
Use.signatures
  .add({
    "sheet.css": (options, { owner, path }) => {
      options.raw = true;
    },
  })
  .processors.add({
    "sheet.css": new Processor(
      async (result, { owner, path }) => {
        const { Sheet } = await owner.module("@/rollosheet/");
        const sheet = new Sheet(result, {
          name: path.path,
        });
        return sheet;
      },

      { cache: true }
    ),
  });

/* Add '.x.html' processor */
Use.processors.add({
  "x.html": new Processor(
    async (result, { owner, path }) => {
      const { component } = await owner.module("@/rollocomponent/");
      const dom = component.div({ innerHTML: result });
      /* Get type */
      const type = (() => {
        const meta = dom.querySelector(`meta[type]`);
        if (meta) {
          return meta.getAttribute("type");
        }
      })();
      /* 'component' type */
      if (type === "component") {
        const { author } = await owner.module("@/rollocomponent/");
        const assets = await Assets.create(dom);
        const script = dom.querySelector("script[main]");
        /* Create module */
        const module = await construct(
          `${script.textContent.trim()}\n//# sourceURL=${path.path}`
        );
        /* Get cls */
        const cls = await module.default({
          assets,
          dom,
          path,
        });
        /* Create instance factory */
        const key = cls.__key__
          ? cls.__key__
          : `rollo-${path.stem.replaceAll("_", "-")}`;
        const factory = author(cls, key);
        /* Handle callback */
        if (cls.__factory__) {
          await cls.__factory__(factory);
        }
        return factory;
      }
      /* 'assets' type */
      if (type === "assets") {
        const assets = await Assets.create(dom, { path });
        return Object.freeze(assets);
      }
      /* Unspecified type */
      if (!type) {
        const assets = await Assets.create(dom, { path });
        const script = dom.querySelector("script[main]");
        if (script) {
          const module = await construct(
            `${script.textContent.trim()}\n//# sourceURL=${path.path}`
          );
          if ("default" in module) {
            return await module.default({ assets, dom, path });
          } else {
            if (Object.keys(assets).length) {
              return Object.freeze({ ...assets, ...module });
            } else {
              return module;
            }
          }
        } else {
          return Object.freeze(assets);
        }
      }
    },
    {
      cache: true,
    }
  ),
});

/* Add '.md' processor */
Use.processors.add({
  md: new Processor(
    async (result, { owner, path }) => {
      const { parse } = await owner.module("@/rollolibs/marked.js");
      return parse(result).trim();
    },
    { cache: true }
  ),
});

/* Add '.yaml' processor */
Use.processors.add({
  yaml: new Processor(
    async (result, { owner, path }) => {
      const { parse } = await owner.module("@/rollolibs/yaml/");
      return parse(result);
    },
    {
      cache: false,
    }
  ),
});

/* Add '.csv' processor */
Use.processors.add({
  csv: new Processor(
    async (result, { owner, path }) => {
      const { Papa } = await owner.module("@/rollolibs/papa.js");
      return Papa.parse(result);
    },
    { cache: false }
  ),
});
