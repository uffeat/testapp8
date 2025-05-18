////import "@/main/development/meta/init.js";
//import { test } from "@/rollotest/test.js";

console.info("Vite environment:", import.meta.env.MODE);

import { Modules } from "@/rollovite/tools/modules.js";

await (async () => {
  const modules = new Modules(import.meta.glob("/src/test/foo/**/*.js"), {
    base: "@/test/foo",
    type: "js",
  });
  console.log("foo:", (await modules.import("foo")).foo);
  console.log("foo:", (await modules.import("foo.js")).foo);
  console.log("foo:", (await modules.$.foo.js).foo);
  console.log("foo:", (await modules.$.foo[":js"]).foo);
})();

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

await (async () => {
  const modules = new Modules(
    import.meta.glob("/src/test/**/*.html", {
      query: "?raw",
      import: "default",
    }),
    { base: "@/test", query: "?raw", type: "html" }
  );
  console.log("html:", await modules.import("foo/foo"));
  console.log("html:", await modules.import("foo/foo.html"));
})();

/* Tests */
await (async () => {
  /* Unit tests */
  await (async () => {
    const KEY = "unit_test";
    let path = localStorage.getItem(KEY) || "";

    window.addEventListener("keydown", async (event) => {
      if (event.code === "KeyU" && event.shiftKey) {
        /* Call tests as unit tests */

        path = prompt("Path:", path);
        if (path) {
          localStorage.setItem(KEY, path);
        }
      }
    });
  })();

  /* Batch tests */
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      /* Call tests as non-unit tests */
    }
  });
})();
