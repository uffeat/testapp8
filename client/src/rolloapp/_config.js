/*
import "@/rolloapp/_config.js";
*/

import { construct } from "@/rolloapp/tools/construct.js";
import { ImportMap } from "@/rolloapp/tools/import_map.js";
import { Processor } from "@/rolloapp/tools/processor.js";
import { app } from "@/rolloapp/_app.js";

/* Add support for common file types */
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
      import.meta.glob(["/src/**/*.js", "!/src/rollotest/**/*.*"]),
      { type: "js" }
    ),
    new ImportMap(
      import.meta.glob(["/src/**/*.js", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
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

        const build_assets = async (wrapper) => {
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
          return assets;
        };

        const wrapper = component.div({ innerHTML: result });

        const type = (() => {
          const meta = wrapper.querySelector(`meta[type]`);
          if (meta) {
            return meta.getAttribute("type");
          }
        })();
        //console.log("type:", type); //
        if (type === "component") {
          const assets = await build_assets(wrapper);
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
          const assets = await build_assets(wrapper);
          return Object.freeze(assets);
        }

        if (!type) {
          const assets = await build_assets(wrapper);
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
  });
