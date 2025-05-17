////import "@/rollometa/init.js";
//import { test } from "@/rollotest/test.js";

console.info("Vite environment:", import.meta.env.MODE);

import { assets } from "@/rollovite/tools/assets";

/* */
await (async () => {
  console.log("foo:", (await assets.import("/test/foo/foo.js")).foo);
  console.log("foo:", (await assets.$.test.foo.foo.js).foo);
})();

/* */
await (async () => {
  console.log("foo:", await assets.import("/test/foo/foo.js?raw"));
  console.log("foo:", await assets.$.test.foo.foo[':js?raw']);
})();

/* */
await (async () => {
  console.log("paths:", await assets.paths());
  
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
