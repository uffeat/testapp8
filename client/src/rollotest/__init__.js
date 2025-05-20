import { Modules } from "@/rollovite/modules.js";

const PUBLIC_BATCH_PATHS = Object.freeze(
  await use("/rollotest/batch/__manifest__.json")
);
const STORAGE_KEY = "unit_test";

/* Utility for importing test modules.
NOTE
- Test modules should reside in public. However, for special cases, where test
  modules uses build-related features, test modules should reside in rollotests.
  'test' manages such tests. */
const test = new Modules(import.meta.glob(["/src/rollotest/**/*.test.js"]), {
  base: "@/rollotest",
  type: "js",
});

/* Enable triggering of tests */
window.addEventListener("keydown", async (event) => {
  /* Runs unit test */
  if (event.code === "KeyU" && event.shiftKey) {
    const path = prompt("Path:", localStorage.getItem(STORAGE_KEY) || "");
    if (path) {
      const _path = `${path}.test.js`;
      if (test.has(_path)) {
        await test.import(_path);
      } else {
        await use(`/rollotest/${path}`);
      }
      localStorage.setItem(STORAGE_KEY, path);
    }
    return;
  }
  /* Runs batch tests */
  if (event.code === "KeyT" && event.shiftKey) {
    await test.batch();
    for (const path of PUBLIC_BATCH_PATHS) {
      await use(path);
    }
    return;
  }
});



      