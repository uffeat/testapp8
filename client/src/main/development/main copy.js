////import "@/rollometa/init.js";
import { test } from "@/rollotest/test.js";

console.info("Vite environment:", import.meta.env.MODE);

/* Tests */
await (async () => {
  /* Unit tests by hash */
  (() => {
    const on_hash_change = async (event) => {
      /* Call tests as unit tests */
      test.processor.define(async (module) => {
        const tests = Object.values(module);
        for (const test of tests) {
          await test.call?.(this, true);
        }
      });

      const path = location.hash ? location.hash.slice(1) : null;
      if (path) {
        await test.import(`${path}.test.js`);
      }
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
        test.processor.define(async (module) => {
          const tests = Object.values(module);
          for (const test of tests) {
            await test.call?.(this, true);
          }
        });

        path = prompt("Path:", path);
        if (path) {
          localStorage.setItem(KEY, path);
          await test.import(`${path}.test.js`);
        }
      }
    });
  })();

  /* Batch tests */
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      /* Call tests as non-unit tests */
      test.processor.define(async (module) => {
        const tests = Object.values(module);
        for (const test of tests) {
          await test.call?.(this);
        }
      });

      test.import((path) => path.includes("/batch/"));
    }
  });
})();
