import { marked } from "marked";
import { server } from "@/rolloanvil/server.js";
import { Modules } from "@/rollovite/modules.js";
import { map } from "@/rollo/tools/object/map.js";

/* TODO
- Experiment markdown features, incl.
  - images
  - links
*/

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

const data = map(await modules.batch(), ([path, content]) => [
  path.replace(".md", ".template"),
  content,
]);

try {
  const result = await server.md(data);
  //console.log("data:", data); ////
  console.log("result:", result);
} catch {
  console.warn("Endpoint failed");
}
