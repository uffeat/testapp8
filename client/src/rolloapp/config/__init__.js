/*
import "@/rolloapp/_config.js";
*/

import { ImportMap } from "@/rolloapp/tools/import_map.js";
import { Processor } from "@/rolloapp/tools/processor.js";
import { app } from "@/rolloapp/app.js";

/* Add support for common file types */
app.maps
  .add(
    new ImportMap(
      import.meta.glob([
        "/src/**/*.css",
        "!/src/rollotest/tests/**/*.*",
        //"!/src/nowhere/**/*.*"//
      ]),
      { type: "css" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.css", "!/src/rollotest/tests/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { raw: true, type: "css" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.html", "!/src/rollotest/tests/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { type: "html" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.js", "!/src/rollotest/tests/**/*.*"]),
      { type: "js" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.js", "!/src/rollotest/tests/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { raw: true, type: "js" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.json", "!/src/rollotest/tests/**/*.*"]),
      { type: "json" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.json", "!/src/rollotest/tests/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { raw: true, type: "json" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.svg", "!/src/rollotest/tests/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      { type: "svg" }
    )
  )
  /* Add csv support */
  .maps.add(
    new ImportMap(
      import.meta.glob(["/src/**/*.csv", "!/src/rollotest/tests/**/*.*"], {
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
      import.meta.glob(["/src/**/*.md", "!/src/rollotest/tests/**/*.*"], {
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
      import.meta.glob(["/src/**/*.yaml", "!/src/rollotest/tests/**/*.*"], {
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
        const { build } = await owner.import("@/rolloapp/tools/assets.js");
        const { construct } = await owner.import(
          "@/rolloapp/_tools/construct.js"
        );

        const wrapper = component.div({ innerHTML: result });

        const type = (() => {
          const meta = wrapper.querySelector(`meta[type]`);
          if (meta) {
            return meta.getAttribute("type");
          }
        })();
        //console.log("type:", type); //
        if (type === "component") {
          const assets = await build(wrapper);
          const script = wrapper.querySelector("script[main]");
          /* Create module */
          const module = await construct(
            `${script.textContent.trim()}\n//# sourceURL=${path.path}`
          );
          /* Get cls */
          const cls = await module.default(assets);
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
              return await module.default(assets);
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

  /* Add .sheet.css support */
  .signatures.add({
    "sheet.css": (options, { owner, path }) => {
      options.raw = true;
    },
  })
  .processors.add({
    "sheet.css": new Processor(
      async (result, { owner, path }) => {
        const { Sheet } = await owner.import("@/rollosheet/");
        const sheet = new Sheet(result, {
          name: path.path,
        });
        return sheet;
      },

      { cache: true }
    ),
  });


