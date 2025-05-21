/*
import "@/main/development/rollomd/__init__.js"
20250521
*/

import { marked } from "marked";
import { server } from "@/rolloanvil/server.js";
import { Modules } from "@/rollovite/modules.js";
import { map } from "@/rollo/tools/object/map.js";

const modules = new Modules(
  import.meta.glob("/src/main/development/rollomd/src/**/*.md", {
    query: "?raw",
    import: "default",
  }),
  {
    base: "@/main/development/rollomd/src",
    processor: (result) => marked.parse(result).trim(),
    type: "md",
  }
);


const update = async () => {
  /* NOTE Vercel injects a script into public html files, therefore use .template */
  const data = map(await modules.batch(), ([path, content]) => [
    path.replace(".md", ".template"),
    content,
  ]);
  //console.log("data:", data); ////
  try {
    const result = await server.md(data);
    console.log("result:", result);
  } catch {
    console.warn("Endpoint failed");
  }
};

/* Trigger build */
window.addEventListener("keydown", async (event) => {
  if (event.code === "KeyD" && event.shiftKey) {
    await update();
    console.info(`Built md-parsed files.`);
    return;
  }
});
