import "@/rolloapp/assets/main.css";
import { meta } from "@/meta.js";
import { author, base, component } from "@/rollocomponent/rollocomponent.js";
import { Sheet } from "@/rollosheet/sheet.js";

import { Assets } from "@/rolloapp/tools/assets";
import { Imports } from "@/rolloapp/tools/imports.js";
import { Path } from "@/rolloapp/tools/path.js";
import { Processor } from "@/rolloapp/tools/processor.js";
import { Processors } from "@/rolloapp/tools/processors.js";
import { Public } from "@/rolloapp/tools/public.js";
import { Signatures } from "@/rolloapp/tools/signatures.js";
import { TypeHooks } from "@/rolloapp/tools/type_hooks.js";
import { construct } from "@/rolloapp/tools/construct.js";

const App = author(
  class extends base() {
    static __key__ = "rollo-app";

    #_ = {};

    constructor() {
      super();
      const owner = this;

      this.#_.config = new (class {
        #_ = {};

        constructor() {
          this.#_.imports = new Imports(owner);
          this.#_.processors = new Processors(owner);
          this.#_.signatures = new Signatures(owner);
          this.#_.typeHooks = new TypeHooks(owner);
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
      })();

      this.id = "app";

      this.shadow.append(
        component.div({}, component.slot({ name: "data" })),
        component.div({}, component.slot({ name: "modal" }))
      );
    }

    __new__() {
      super.__new__?.();
      const owner = this;

      this.attribute.dev = meta.env.DEV;
      this.attribute.environment = meta.env.name;
      this.attribute.origin = meta.env.origin;
    }

    get config() {
      return this.#_.config;
    }

    async import(specifier, options = {}) {
      const path = new Path(specifier);

      /* Type hooks */
      if (this.config.typeHooks.has(path.type)) {
        const loader = this.config.typeHooks.get(path.type);
        return await loader(specifier);
      }

      /* Signature */
      if (this.config.signatures.has(path.types)) {
        const handler = this.config.signatures.get(path.types);
        await handler(options, { owner: this, path });
      }
      const { cache = true, raw = false } = options;

      /* Import */
      const result = path.public
        ? await Public.import(path, { cache, raw })
        : await this.config.imports.import(path, { raw });

      /* Process */
      if (this.config.processors.has(path.types)) {
        const processor = this.config.processors.get(path.types);
        const processed = await processor.call(path.path, result, {
          owner: this,
          path,
          cache,
        });
        if (processed !== undefined) return processed;
      }

      return result;
    }
  }
);

export const app = App({ id: "app", parent: document.body });

Object.defineProperty(window, "app", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: app,
});

/* Add 'use' to global namespace */
Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: new Proxy(() => {}, {
    get: (_, key) => app.config[key],
    apply: (_, __, args) => app.import(...args),
  }),
});

/* Add capability to import selected JS modules from src. */
app.config.imports.add(
  import.meta.glob([
    "/src/meta.js",
    "/src/rollocomponent/rollocomponent.js",
    "/src/rollosheet/rollosheet.js",
    "/src/rollostate/rollostate.js",
     "/src/rollotest/rollotest.js",
    "/src/rollotools/**/*.js",
  ])
);
/* Add capability to import CSS modules from src */
app.config.imports.add(import.meta.glob(["/src/**/*.css", "!/src/main.css"]));

/* Add capability to import raw CSS modules from src */
app.config.imports.add(
  import.meta.glob(["/src/**/*.css"], {
    query: "?raw",
    import: "default",
  }),
  { raw: true }
);

/* Add capability to import raw HTML modules from src */
app.config.imports.add(
  import.meta.glob(["/src/**/*.html"], {
    query: "?raw",
    import: "default",
  }),
  { raw: true }
);

/* Add '.sheet.css' processor */
app.config.signatures.add({
  "sheet.css": (options, { owner, path }) => {
    options.raw = true;
  },
});

app.config.processors.add({
  "sheet.css": new Processor(
    async (result, { owner, path }) => {
      const sheet = new Sheet(result, {
        name: path.path,
      });
      return sheet;
    },
    { cache: true }
  ),
});

/* Add '.x.html' processor */
app.config.processors.add({
  "x.html": new Processor(
    async (result, { owner, path }) => {
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

await app.shadow.sheets.import(
  "@/rollolibs/bootstrap/reboot",
  "@/rolloapp/assets/shadow"
);
