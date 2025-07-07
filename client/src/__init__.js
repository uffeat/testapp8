import "@/main.css";
import { Processor, app, build, construct } from "@/rolloapp/__init__.js";
import { anvil } from "@/rolloanvil/__init__.js";
import { bootstrap } from "@/rollolibs/bootstrap/__init__.js";
import {
  author,
  base,
  component,
  mix,
  mixins,
} from "@/rollocomponent/__init__.js";
import { meta } from "@/rollometa/meta.js";
import { Sheet } from "@/rollosheet/tools/sheet.js";

/* Configure import capabilities */
(() => {
  /* Add raw css imports */
  app.imports
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
    )

    /* Add js imports */
    .imports.add(
      import.meta.glob([
        "/src/rolloanvil/__init__.js",
        "/src/rollostate/**/*.js",
        "/src/rollotools/**/*.js",
      ])
    );

  /* Add .sheet.css support */
  app.signatures
    .add({
      "sheet.css": (options, { owner, path }) => {
        options.raw = true;
      },
    })
    .processors.add({
      "sheet.css": new Processor(
        async (result, { owner, path }) => {
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
              path
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
                return await module.default({assets, dom: wrapper, path});
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
          const { parse } = await owner.import("/rollolibs/marked.js");
          return parse(result).trim();
        },
        { cache: true }
      ),
    })

    /* Add yaml support */
    .processors.add({
      yaml: new Processor(
        async (result, { owner, path }) => {
          const { yaml } = await owner.import("/rollolibs/yaml/");
          return yaml(result);
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
          const { Papa } = await owner.import("/rollolibs/papa/");
          return Papa.parse(result);
        },
        { cache: false }
      ),
    });
})();

/* Add globals */
(() => {
  Object.defineProperty(window, "app", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: app,
  });
  Object.defineProperty(window, "anvil", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: anvil,
  });

  Object.defineProperty(window, "bootstrap", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: bootstrap,
  });
  Object.defineProperty(window, "component", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: component,
  });
  Object.defineProperty(window, "meta", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: meta,
  });
  Object.defineProperty(window, "use", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: new Proxy(() => {}, {
      get: (_, key) => app[key],
      apply: (_, __, args) => app.import(...args),
    }),
  });
})();

/* Style app */
await (async () => {
  await app.shadow.sheets.import("/rolloapp/assets/shadow");
  await app.import("/rolloapp/assets/main.css");
})();
