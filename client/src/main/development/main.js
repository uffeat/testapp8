////import "@/main/development/meta/init.js";
import { test } from "@/rollotest/test.js";

console.info("Vite environment:", import.meta.env.MODE);

import "@/main/development/ssg/md/md.js"


/* Tests */
await (async () => {
  /* Unit tests */
  await (async () => {
    const KEY = "unit_test";
    let path = localStorage.getItem(KEY) || "";
    window.addEventListener("keydown", async (event) => {
      if (event.code === "KeyU" && event.shiftKey) {
        path = prompt("Path:", path);
        if (path) {
          await test.import(`${path}.test.js`);
          localStorage.setItem(KEY, path);
        }
      }
    });
  })();
  /* Batch tests */
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      await test.batch((path) => path.includes("/batch/"));
    }
  });
})();
