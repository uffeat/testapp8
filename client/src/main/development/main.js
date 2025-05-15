

import { component } from "@/rollo/component/component.js";
import { test } from "@/rollotest/test.js";



console.info("Vite environment:", import.meta.env.MODE);






/* Tests */
await (async () => {
  /* Unit tests by hash */
  await (async () => {
    const on_hash_change = async (event) => {
      const path = location.hash ? location.hash.slice(1) : null;
      if (path) {
        await test.unit(path);
      }
    };
    window.addEventListener("hashchange", on_hash_change);
    on_hash_change();
  })();

  /* Batch tests */
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      test.batch();
    }
  });

  /* Unit tests by prompt */
  await (async () => {
    const UNIT_TEST = "unit_test";
    let path = localStorage.getItem(UNIT_TEST) || "";
    window.addEventListener("keydown", async (event) => {
      if (event.code === "KeyU" && event.shiftKey) {
        path = prompt("Path:", path);
        if (path) {
          localStorage.setItem(UNIT_TEST, path);
          await test.unit(path);
        }
      }
    });
  })();
})();
