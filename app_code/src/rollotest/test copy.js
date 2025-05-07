/* */
export const test = new (class Test {
  #loaders = import.meta.glob("/src/rollotest/tests/**/*.test.js");
  constructor() {
    // Nothing here yet...
  }

  /* */
  async batch() {
    let count = 0;
    for (const [path, load] of Object.entries(this.#loaders)) {
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

  /* */
  async unit(path) {
    const load = this.#loaders[`/src/rollotest/tests/${path}.test.js`];
    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }
    const module = await load();
    const tests = Object.values(module);
    for (const test of tests) {
      await test(true);
    }
  }
})();