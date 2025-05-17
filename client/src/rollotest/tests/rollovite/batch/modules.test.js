/*
rollovite/batch/modules
*/
import { Modules } from "@/rollovite/modules.js";

await (async () => {
  const modules = new Modules(import.meta.glob("/src/test/**/*.js"), {
    type: "js",
  });
  console.log("type:", modules.type);
  console.log("query:", modules.query);
  console.log("foo:", (await modules.import("@/test/foo/foo.js")).foo);
  console.log("foo:", (await modules.$.test.foo.foo.js).foo);
})();

