/*
import "@/rolloapp/_config.js";
*/

import { Processor } from "@/rolloapp/tools/processor.js";
import { app } from "@/rolloapp/app.js";

import { build } from "@/rolloapp/tools/assets.js";
import { construct } from "@/rolloapp/tools/construct.js";

import { Sheet } from "@/rollosheet/__init__.js";

import { yaml } from "@/rollolibs/yaml/__init__.js";

import {
  author,
  base,
  component,
  mix,
  mixins,
} from "@/rollocomponent/__init__.js";


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
  });

/* Add support for x.html */
app.processors.add({
  "x.html": new Processor(
    async (result, { owner, path }) => {
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
        const cls = await module.default({ assets, author, base, mix, mixins });
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
});

/* Add md support */
app.processors.add({
  md: new Processor(
    async (result, { owner, path }) =>
      (await owner.import("/rollolibs/marked.js")).parse(result).trim(),
    { cache: true }
  ),
});

/* Add yaml support */
app.processors.add({
  yaml: new Processor(async (result, { owner, path }) => yaml(result), {
    cache: false,
  }),
});
