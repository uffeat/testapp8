/*
rollovite/batch/local_modules
*/
import { LocalModules } from "@/rollovite/tools/modules.js";


await (async () => {
  const modules = new LocalModules(import.meta.glob("/src/test/foo/**/*.js"), {
    base: "@/test/foo",
    type: "js",
  });
  console.log("foo:", (await modules.import("foo")).foo);
  console.log("foo:", (await modules.import("foo.js")).foo);
  console.log("foo:", (await modules.$.foo.js).foo);
  console.log("foo:", (await modules.$.foo[":js"]).foo);
})();

await (async () => {
  const modules = new LocalModules(import.meta.glob("/src/test/**/*.js"), {
    base: "@/test",
    local: true,
    type: "js",
  });
  console.log("foo:", (await modules.import("foo/foo")).foo);
  console.log("foo:", (await modules.import("foo/foo.js")).foo);
  console.log("foo:", (await modules.$.foo.foo.js).foo);
  console.log("foo:", (await modules.$.foo.foo[":js"]).foo);
})();



await (async () => {
  const modules = new LocalModules(
    import.meta.glob("/src/test/**/*.html", {
      query: "?raw",
      import: "default",
    }),
    { base: "@/test", query: "?raw", type: "html", }
  );
  console.log("html:", await modules.import("foo/foo"));
  console.log("html:", await modules.import("foo/foo.html"));
})();