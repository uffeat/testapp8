/*
import "@/rollotest/__init__.js";
20250526
v.1.1
*/

import { Modules } from "@/rollovite/modules.js";

if (import.meta.env.DEV || import.meta.env.VERCEL_ENV === "preview") {
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
        await test.import(`tests/${path}.test.js`);
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
