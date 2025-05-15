////import "@/rollometa/init.js";
import { test } from "@/rollotest/test.js";

console.info("Vite environment:", import.meta.env.MODE);

/* Tests */
await (async () => {
  const processor = test.processor.get();
  console.log('processor:', processor);////

  const unit = async (module) => {
        const tests = Object.values(module);
        for (const test of tests) {
          await test.call?.(this, true);
        }
      }
      async (module) => {
        const tests = Object.values(module);
        for (const test of tests) {
          await test.call?.(this, true);
        }
      }

  const batch = async (module) => {
        const tests = Object.values(module);
        for (const test of tests) {
          await test.call?.(this);
        }
      }




  /* Unit tests by hash */
  (() => {
    const on_hash_change = async (event) => {
      /* Call tests as unit tests */
      processor.source = unit

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
        processor.source = unit

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
      processor.source = batch
      

      test.import((path) => path.includes("/batch/"));
    }
  });
})();
