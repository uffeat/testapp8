/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

import { test } from "@/rollotest/test.js";

import { component } from "@/rollo/component/component.js";
import { Check } from "@/rolloui/components/form/check.js";

import { module } from "@/rollo/tools/module.js";

console.info("Vercel environment:", import.meta.env.VERCEL_ENV);

document.querySelector("html").dataset.bsTheme = "dark";

document.body.append(Check());

/* Tests */
await (async () => {
  /* Unit tests by prompt */
  await (async () => {
    let path = "";
    window.addEventListener("keydown", async (event) => {
      if (event.code === "KeyU" && event.shiftKey) {
        path = prompt("Path:", path);
        if (path) {
          await test.unit(path);
        }
      }
    });
  })();
})();
