/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

console.info("Vite environment:", import.meta.env.MODE);



const { foo } = await modules.import.public.test.foo.foo.js
console.log('foo:', foo)

const raw_foo = await modules.import.src.test.foo.foo.js$raw
console.log('raw_foo:', raw_foo)

/* Tests */
await (async () => {
  const test = new (class Test {
    #loaders = import.meta.glob("/src/main/development/tests/**/*.test.js");
    constructor() {}

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

    async unit(path) {
      const load = this.#loaders[`/src/main/development/tests/${path}.test.js`];
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

  await (async () => {
    const on_hash_change = async (event) => {
      const path = location.hash ? location.hash.slice(1) : null;
      if (path) {
        await test.unit(path);
      }
    };
    window.addEventListener("hashchange", on_hash_change);
    on_hash_change();
  })();

  /* Batch tests */
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      test.batch();
    }
  });

  /* Unit tests by prompt */
  await (async () => {
    const UNIT_TEST = "unit_test";
    let path = localStorage.getItem(UNIT_TEST) || "";
    window.addEventListener("keydown", async (event) => {
      if (event.code === "KeyU" && event.shiftKey) {
        path = prompt("Path:", path);
        if (path) {
          localStorage.setItem(UNIT_TEST, path);
          await test.unit(path);
        }
      }
    });
  })();
})();
