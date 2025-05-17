////import "@/rollometa/init.js";
//import { test } from "@/rollotest/test.js";

console.info("Vite environment:", import.meta.env.MODE);

import { modules } from "@/rollovite/modules.js";

await (async () => {
  console.log("foo:", (await modules.import("@/test/foo/foo.js")).foo);
  console.log("foo:", (await modules.src.test.foo.foo.js).foo);
})();

await (async () => {
  console.log("foo:", (await modules.import("/test/foo/foo.js")).foo);
  console.log("foo:", (await modules.public.test.foo.foo.js).foo);
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
