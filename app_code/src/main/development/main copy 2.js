/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

console.info("Vite environment:", import.meta.env.MODE);




const test = new (class Test {
  constructor() {

  }

  async batch() {
    
  }
})();







const loaders = import.meta.glob("/src/main/development/tests/**/*.test.js");


const path = location.hash ? location.hash.slice(1) : null;
if (path) {
  await run_unit_test(path);
}

async function run_batch_tests() {
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

async function run_unit_test(path) {
  const load = loaders[`/src/main/development/tests/${path}.test.js`];
  if (!load) {
    throw new Error(`Invalid path: ${path}`);
  }
  const module = await load();
  const tests = Object.values(module);
  for (const test of tests) {
    await test(true);
  }
}

/* Tests */
await (async () => {
  /* Batch tests */
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      run_batch_tests();
    }
  });

  /* Unit (single-file) tests */
  const UNIT_TEST = "unit_test";
  let path = localStorage.getItem(UNIT_TEST) || "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyU" && event.shiftKey) {
      path = prompt("Path:", path);
      if (path) {
        localStorage.setItem(UNIT_TEST, path);
        await run_unit_test(path);
      }
    }
  });
})();
