/*
rollovite/batch/modules
*/

import { Modules } from "@/rollovite/tools/modules.js";

/* js */
await (async () => {
  const modules = new Modules(import.meta.glob("/src/test/**/*.js"), {
    base: "@/test",
    type: "js",
  });
  console.log("foo:", (await modules.import("foo/foo")).foo);
  console.log("foo:", (await modules.import("foo/foo.js")).foo);
  console.log("foo:", (await modules.$.foo.foo.js).foo);
  console.log("foo:", (await modules.$.foo.foo[":js"]).foo);
})();

/* raw js */
await (async () => {
  const modules = new Modules(
    import.meta.glob("/src/test/**/*.js", {
      query: "?raw",
      import: "default",
    }),
    {
      base: "@/test",
      /* NOTE 'query' could be set; makes no difference here. */
      type: "js",
    }
  );
  console.log("raw:", await modules.import("foo/foo.js"));
  console.log("raw:", await modules.$.foo.foo.js);
  console.log("raw:", await modules.$.foo.foo[":js"]);
})();

/* html */
await (async () => {
  const modules = new Modules(
    import.meta.glob("/src/test/**/*.html", {
      query: "?raw",
      import: "default",
    }),
    {
      base: "@/test",
      /* NOTE 
      'query' could be set (makes no difference here). */
      type: "html",
    }
  );
  console.log("html:", await modules.import("foo/foo"));
  console.log("html:", await modules.import("foo/foo.html"));
})();