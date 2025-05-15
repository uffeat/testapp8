import { modules } from "@/rollovite/modules";

/* */
export const test = new (class Test {
  #loaders = import.meta.glob("/src/rollotest/tests/**/*.test.js");
  constructor() {
    // Nothing here yet...
  }

  /* */
  async batch() {
    let count = 0;

    /* */
    const paths =
      modules.public.paths((path) => path.startsWith("/tests/batch/")) || [];
    for (const path of paths) {
      const module = await modules.get(path);
      const tests = Object.values(module);
      for (const test of tests) {
        count++;
        test.call?.(this);
      }
    }

    /* */
    for (const [path, load] of Object.entries(this.#loaders)) {
      if (!path.includes("/batch/")) continue;
      const module = await load();
      const tests = Object.values(module);
      for (const test of tests) {
        count++;
        test.call?.(this);
      }
    }
    console.info(`Invoked ${count} test functions.`);
  }

  /* */
  async unit(path) {
    let module;
    if (path.startsWith("/")) {
      module = await modules.get(`/tests${path}.test.js`);
    } else {
      const load = this.#loaders[`/src/rollotest/tests/${path}.test.js`];
      if (!load) {
        throw new Error(`Invalid path: ${path}`);
      }
      module = await load();
    }
    const tests = Object.values(module);
    for (const test of tests) {
      await test.call?.(this, true);
    }
  }
})();




