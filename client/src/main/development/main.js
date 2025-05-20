//import "@/main/development/rollomd/__init__.js";
//import "@/main/development/rollometa/__init__.js";
import { test } from "@/rollotest/test.js";

console.info("Vite environment:", import.meta.env.MODE);



/* Tests */
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
    /* Builds md-parsed files */
    if (event.code === "KeyD" && event.shiftKey) {
      await import("@/main/development/rollomd/__init__.js");
      console.info(`Built md-parsed files.`);
      return;
    }
    /* Updates files in 'src/rollometa' */
    if (event.code === "KeyM" && event.shiftKey) {
      await import("@/main/development/rollometa/__init__.js");
      console.info(`Updated meta files.`);
      return;
    }
  });
})();
