import { marked } from "marked";
import { server } from "@/rolloanvil/server.js";
import { Modules } from "@/rollovite/modules.js";
import { map } from "@/rollo/tools/object/map.js";

const src = new Modules(
  import.meta.glob("/src/main/development/ssg/src/**/*.md", {
    query: "?raw",
    import: "default",
  }),
  {
    base: "@/main/development/ssg/src",
    processor: (result) => marked.parse(result).trim(),
    type: "md",
  }
);

const data = map(await src.batch(), ([path, content]) => [
  path.replace(".md", ".html"),
  content,
]);

try {
  const result = await server.ssg(data);
  //console.log("data:", data); ////
  console.log("result:", result);
} catch {
  console.warn("'ssg' endpoint could not be reached");
}
