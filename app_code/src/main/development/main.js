/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

//import { modules } from "@/rollovite/modules.js";

import { component } from "@/rollo/component/component.js";
import { Check } from "@/rolloui/components/form/check.js";
/*
const { component } = await modules.get("@/rollo/component/component.js");
const { Check } = await modules.get("@/rolloui/components/form/check.js");
*/



console.info("Vite environment:", import.meta.env.MODE);

document.querySelector("html").dataset.bsTheme = "dark";

document.body.append(Check());

/* Batch tests */
(async () => {
  const loaders = import.meta.glob(
    "/src/main/development/tests/batch/**/*.test.js"
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
  const loaders = import.meta.glob("/src/main/development/tests/**/*.test.js");

  let path = "";

  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyU" && event.shiftKey) {
      path = prompt("Path:", path);
      if (path) {
        const load = loaders[`/src/main/development/tests/${path}.test.js`];
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
