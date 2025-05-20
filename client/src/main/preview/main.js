import { test } from "@/main/preview/test.js";



import { component } from "@/rollo/component/component.js";
import { Check } from "@/rolloui/components/form/check.js";



console.info("Vercel environment:", import.meta.env.VERCEL_ENV);

document.querySelector("html").dataset.bsTheme = "dark";

document.body.append(Check());



/* Test */
(() => {
  window.addEventListener("keydown", async (event) => {
    /* Runs unit test */
    if (event.code === "KeyU" && event.shiftKey) {
      const path = prompt("Path:", localStorage.getItem("unit_test") || "");
      if (path) {
        await test.import(`${path}.test.js`);
        localStorage.setItem("unit_test", path);
      }
      return;
    }
    /* Runs batch tests */
    if (event.code === "KeyT" && event.shiftKey) {
      await test.batch((path) => path.includes("/batch/"));
      return;
    }
    
  });
})();