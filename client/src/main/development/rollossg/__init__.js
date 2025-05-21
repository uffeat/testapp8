/*
import "@/main/development/rollossg/__init__.js"
20250521
*/

import { marked } from "marked";
import { server } from "@/rolloanvil/server.js";
import { Modules } from "@/rollovite/modules.js";
import { map } from "@/rollo/tools/object/map.js";
import { component } from "@/rollo/component/component.js";

import template from "@/main/development/rollossg/template.jinja?raw";

//console.log('template: ', template)////

const modules = new Modules(
  import.meta.glob("/src/main/development/rollossg/src/**/*.md", {
    query: "?raw",
    import: "default",
  }),
  {
    base: "@/main/development/rollomd/src",
    processor: (result) => {
      const parsed = marked.parse(result).trim();
      const container = component.div({ innerHTML: parsed });
      const element = container.querySelector("meta");
      element.remove();
      const meta = Object.fromEntries(
        Array.from(element.attributes, ({ name, value }) => [name, value])
      );
      //console.log("meta: ", meta); ////

      return { html: container.innerHTML, meta };
    },
    type: "md",
  }
);

/* Calls endpoint. */
const update = async () => {
  /* NOTE Vercel injects a script into public html files, therefore use .template */
  const content = map(await modules.batch(), ([path, content]) => [
    path.replace(".md", ".template"),
    content,
  ]);

  const data = { template, content };

   

  console.log("data: ", data); ////

  try {
    const result = await server.ssg(data);
    console.log("result:", result);
  } catch {
    console.warn("Endpoint failed");
  }
};

/* Trigger build */
window.addEventListener("keydown", async (event) => {
  if (event.code === "KeyS" && event.shiftKey) {
    await update();
    console.info(`SSG done.`);
    return;
  }
});
