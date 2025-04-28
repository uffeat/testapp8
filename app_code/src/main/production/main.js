/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

import { vercel } from "@/rollovercel/vercel.js";

import { component } from "@/rollo/component/component.js";
import { Check } from "@/rolloui/components/form/check.js";

document.querySelector("html").dataset.bsTheme = "dark";

document.body.append(Check());



/* Enable triggering of tests.
NOTE
- These tests should be confined to features not available in Vite development, 
  e.g., serverless functions. All other tests should be relegated to 
  main/development/tests  */
if (!vercel.environment.PRODUCTION) {
  /* Batch tests */
  (async () => {
    const loaders = import.meta.glob(
      "/src/main/production/tests/batch/**/*.test.js"
    );

    window.addEventListener("keydown", async (event) => {
      if (event.code === "KeyT" && event.shiftKey) {
        let count = 0;

        for (const [path, load] of Object.entries(loaders)) {
          const module = await load();
          const tests = Object.values(module);
          for (const test of tests) {
            count++;
            test();
          }
        }
        console.info(`Invoked ${count} test functions.`);
      }
    });
  })();

  /* Single-file tests */
  (() => {
    const loaders = import.meta.glob(
      "/src/main/production/tests/**/*.test.js"
    );

    let path = "";

    window.addEventListener("keydown", async (event) => {
      if (event.code === "KeyU" && event.shiftKey) {
        path = prompt("Path:", path);
        if (path) {
          const load = loaders[`/src/main/production/tests/${path}.test.js`];
          if (!load) {
            throw new Error(`Invalid path: ${path}`);
          }
          const module = await load();
          const tests = Object.values(module);
          for (const test of tests) {
            test(true);
          }
        }
      }
    });
  })();
}
