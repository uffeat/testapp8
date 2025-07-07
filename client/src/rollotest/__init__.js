/*
import "@/rollotest/__init__.js";
20250624
v.1.2
*/

import { Modules } from "@/rollotools/modules.js";

if (meta.env.DEV || meta.env.name === "preview") {
  /* Utility for importing test modules. */
  const test = new Modules(
    import.meta.glob(["/src/rollotest/tests/**/*.test.js"]),
    {
      base: "@/rollotest",
      type: "js",
    }
  );

  /* Enable triggering of tests */
  window.addEventListener("keydown", async (event) => {
    /* Runs unit test */
    if (event.code === "KeyU" && event.shiftKey) {
      const KEY = "unit_test";
      const path = prompt("Path:", localStorage.getItem(KEY) || "");
      if (path) {
        /* First, check if test in src */
        if (test.has(`tests/${path}.test.js`)) {
          await test.import(`tests/${path}.test.js`);
        } else {
          await use(`/rollotest/${path}.test.js`);
        }
        localStorage.setItem(KEY, path);
      }
      return;
    }
    /* Runs batch tests */
    if (event.code === "KeyT" && event.shiftKey) {
      await test.batch((path) => path.includes("/batch/"));
      return;
    }
  });
}
