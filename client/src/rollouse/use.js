/*
import { Use } from "@/rollouse/use.js";
*/

import { Imports } from "@/rollouse/tools/imports.js";
import { Path } from "@/rollouse/tools/path.js";
import { Processors } from "@/rollouse/tools/processors.js";
import { Signatures } from "@/rollouse/tools/signatures.js";
import { TypeHooks } from "@/rollouse/tools/type_hooks.js";
import { pub } from "@/rollouse/tools/pub.js";

import { construct } from "@/rollouse/tools/construct.js";
import { Processor } from "@/rollouse/tools/processor.js";

//import { AnvilLoaders } from "@/rolloanvil/main.js";///

console.log('Creating Use...')////

export const Use = new (class {
  #_ = {};

  constructor() {
    this.#_.processors = new Processors(this);
    this.#_.signatures = new Signatures(this);
    this.#_.imports = new Imports(this);
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

Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: new Proxy(() => {}, {
    get: (_, key) => Use[key],
    apply: (_, __, args) => Use.module(...args),
  }),
});

/* Configure import capabilities */
await (async () => {

  console.log('Building import maps...')////



  /* Add js imports */
  Use.imports.add(
    import.meta.glob([
      "/src/**/*.js",
      "!/src/index.js",
      //"!/src/setup.js",
      "!/src/rollolibs/bootstrap/_src/**/*.js",
      "!/src/rollotest/**/*.js",
      "!/src/rollouse/**/*.js",
    ])
  );

  /* Add css imports */
  Use.imports.add(import.meta.glob(["/src/**/*.css", "!/src/main.css"]));

  /* Add raw css imports */
  Use.imports
    .add(
      import.meta.glob(["/src/**/*.css"], {
        query: "?raw",
        import: "default",
      }),
      { raw: true }
    )

    /* Add html imports */
    .imports.add(
      import.meta.glob(["/src/**/*.html"], {
        query: "?raw",
        import: "default",
      }),
      { raw: true }
    );

  //console.log('Importing component stuff...')////
  //const { author, base, component, mix, mixins } = await Use.module("@/rollocomponent/");

  console.log('Importing mixins...')////
  const { mixins } = await Use.module("@/rollocomponent/mixins/mixins.js");

  console.log('Importing author...')////
  const { author } = await Use.module("@/rollocomponent/tools/author.js");
  const { base} = await Use.module("@/rollocomponent/tools/base.js");
  const { component } = await Use.module("@/rollocomponent/component.js");
  const { mix } = await Use.module("@/rollocomponent/tools/mix.js");

  const build = async (wrapper, { path } = {}) => {
    const { Sheet } = await Use.module("@/rollosheet/");
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
          NOTE Injected as links. Not included in 'assets'. */
    for (const element of wrapper.querySelectorAll("style[src]")) {
      const src = element.getAttribute("src");
      await Use.module(src);
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
    return assets;
  };

  //app.typeHooks.add({ py: (specifier) => AnvilLoaders.create(specifier) });//


  console.log('Creating processors...')////

  /* Add .sheet.css support */
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
    })
    /* Add support for x.html */
    .processors.add({
      "x.html": new Processor(
        async (result, { owner, path }) => {
          const wrapper = component.div({ innerHTML: result });

          const type = (() => {
            const meta = wrapper.querySelector(`meta[type]`);
            if (meta) {
              return meta.getAttribute("type");
            }
          })();
          if (type === "component") {
            const assets = await build(wrapper);
            const script = wrapper.querySelector("script[main]");
            /* Create module */
            const module = await construct(
              `${script.textContent.trim()}\n//# sourceURL=${path.path}`
            );
            /* Get cls */
            const cls = await module.default({
              assets,
              author,
              base,
              dom: wrapper,
              mix,
              mixins,
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

          if (type === "assets") {
            const assets = await build(wrapper, { path });
            return Object.freeze(assets);
          }

          if (!type) {
            const assets = await build(wrapper, { path });
            const script = wrapper.querySelector("script[main]");
            if (script) {
              const module = await construct(
                `${script.textContent.trim()}\n//# sourceURL=${path.path}`
              );
              if ("default" in module) {
                return await module.default({ assets, dom: wrapper, path });
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
    })
    /* Add md support */
    .processors.add({
      md: new Processor(
        async (result, { owner, path }) => {
          const { parse } = await owner.module("@/rollolibs/marked.js");
          return parse(result).trim();
        },
        { cache: true }
      ),
    })

    /* Add yaml support */
    .processors.add({
      yaml: new Processor(
        async (result, { owner, path }) => {
          const { parse } = await owner.module("@/rollolibs/yaml/");
          return parse(result);
        },
        {
          cache: false,
        }
      ),
    })
    /* Add csv support */
    .processors.add({
      csv: new Processor(
        async (result, { owner, path }) => {
          const { Papa } = await owner.module("@/rollolibs/papa/");
          return Papa.parse(result);
        },
        { cache: false }
      ),
    });
})();
