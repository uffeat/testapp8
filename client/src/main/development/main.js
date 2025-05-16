////import "@/rollometa/init.js";
//import { test } from "@/rollotest/test.js";

import { Modules } from "@/rollovite/tools/modules.js";

console.info("Vite environment:", import.meta.env.MODE);

await (async () => {
  const modules = new Modules(import.meta.glob("/src/test/foo/**/*.js"), {base: '@/test/foo', type: 'js'});
  console.log("foo:", (await modules.import("foo.js")).foo);
  console.log("foo:", (await modules.import("foo.js")).foo);
  console.log("foo:", (await modules.$.foo[':js']).foo);
  console.log("foo:", (await modules.$.foo[':js']).foo);
})();

await (async () => {
  const modules = new Modules(import.meta.glob("/src/test/bar/**/*.js"), {type: 'js'});
  console.log("bar:", (await modules.import("@/test/bar/bar.js")).bar);
  console.log("bar:", (await modules.$.test.bar.bar[':js']).bar);
  console.log("bar:", (await modules.$.test.bar.bar[':js']).bar);

})();



await (async () => {
  const modules = new Modules(
    import.meta.glob("/src/test/**/*.html", {
      query: "?raw",
      import: "default",
    }),
    { query: "?raw", type: 'html' }
  );
  console.log("foo:", await modules.import("@/test/foo/foo.html"));
  console.log("foo:", await modules.import("@/test/foo/foo.html"));
})();

/* Tests */
await (async () => {
  /* Unit tests by hash */
  (() => {
    const on_hash_change = async (event) => {
      /* Call tests as unit tests */
    };
    window.addEventListener("hashchange", on_hash_change);
    on_hash_change();
  })();

  /* Unit tests by prompt */
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
