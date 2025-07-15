import "@/main.css";

import { Use } from "@/rollouse/use.js";

import { build } from "@/rollouse/tools/assets.js";
import { construct } from "@/rollouse/tools/construct.js";
import { Processor } from "@/rollouse/tools/processor.js";

import "@/rollolibs/bootstrap/bootstrap.js";


//import { AnvilLoaders } from "@/rolloanvil/main.js";///

Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: new Proxy(() => {}, {
    get: (_, key) => Use[key],
    apply: (_, __, args) => Use.module(...args),
  }),
});

const { author, base, component, mix, mixins } = await Use.module(
  "/rollocomponent/"
);

/* Configure import capabilities */
//app.typeHooks.add({ py: (specifier) => AnvilLoaders.create(specifier) });//

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
        const {Sheet} = await owner.module('/rollosheet/')
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
        const { parse } = await owner.module("/rollolibs/marked.js");
        return parse(result).trim();
      },
      { cache: true }
    ),
  })

  /* Add yaml support */
  .processors.add({
    yaml: new Processor(
      async (result, { owner, path }) => {
        const { parse } = await owner.module("/rollolibs/yaml/");
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
        const { Papa } = await owner.module("/rollolibs/papa/");
        return Papa.parse(result);
      },
      { cache: false }
    ),
  });



/* Dark mode */
document.querySelector("html").dataset.bsTheme = "dark";

/* app */
const { app } = await Use.module("/rolloapp/");
Object.defineProperty(window, "app", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: app,
});
await app.shadow.sheets.import("/rolloapp/assets/shadow");
await Use.module("/rolloapp/assets/main.css");


const { meta } = await Use.module("/meta.js");
console.info("Environment:", meta.env.name);
