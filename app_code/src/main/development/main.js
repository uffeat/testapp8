/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

//import { modules } from "@/rollovite/modules.js";

import { component } from "@/rollo/component/component.js";
import { Check } from "@/rolloui/components/form/check.js";

console.info("Vite environment:", import.meta.env.MODE);

document.querySelector("html").dataset.bsTheme = "dark";

document.body.append(Check());

/* Tests */
await (async () => {
  const loaders = import.meta.glob("/src/main/development/tests/**/*.test.js");

  /* Batch tests */
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      let count = 0;

      for (const [path, load] of Object.entries(loaders)) {
        if (!path.includes("/batch/")) continue;
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

  /* Unit (single-file) tests */
  const UNIT_TEST = 'unit_test'
  let path = localStorage.getItem(UNIT_TEST) || '';
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyU" && event.shiftKey) {


      path = prompt("Path:", path);
      if (path) {
        const load = loaders[`/src/main/development/tests/${path}.test.js`];
        if (!load) {
          throw new Error(`Invalid path: ${path}`);
        }
        localStorage.setItem(UNIT_TEST, path);

        const module = await load();
        const tests = Object.values(module);
        for (const test of tests) {
          await test(true);
        }
      }
    }
  });
})();
