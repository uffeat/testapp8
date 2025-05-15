////import "@/rollometa/init.js";
import { test } from "@/rollotest/test.js";

import { Modules } from "@/rollovite/tools/modules.js";

console.info("Vite environment:", import.meta.env.MODE);

const dong = new Modules("js", import.meta.glob("/src/test/**/*.js"), {base: 'test/foo'});
console.log('DONG...')
console.log("ding:", (await dong.$.ding[":js"]).ding);
console.log("ding:", (await dong.import("ding.js")).ding);

console.log("foo:", (await use("@/test/foo/foo.js")).foo);
console.log("foo:", (await use("/test/foo/foo.js")).foo);
console.log("foo:", (await use.$.test.foo.foo[":js"]).foo);
console.log("html:", await use("@/test/foo/foo.html"));
console.log("raw js:", await use("@/test/foo/foo.js?raw"));
console.log("raw js:", await use("/test/foo/foo.js?raw"));

await test.import("foo.test.js");
//await test.$.foo[':test:js']

const stuff = new Modules("js", import.meta.glob("/src/test/**/*.js"));
console.log('STUFF...')
console.log("foo:", (await stuff.import("@/test/foo/foo.js")).foo);
console.log("foo:", (await stuff.$.test.foo.foo[":js"]).foo);
//console.log("foo:", (await stuff.$.test.foo.foo[":js"]).foo);


const thing = new Modules("js", import.meta.glob("/src/test/**/*.js"), {base: 'test'});
console.log('THING...')
console.log("foo:", (await thing.import("foo/foo.js")).foo);
console.log("foo:", (await thing.$.foo.foo[":js"]).foo);
console.log("foo:", (await thing.$.foo.foo[":js"]).foo);


await (async function batch() {
  const modules = await stuff.import((specifier) =>
    ["@/test/batch/a.js", "@/test/batch/b.js"].includes(specifier)
  );
  console.log("modules:", modules);
})();



/* Tests */
await (async () => {
  /* Unit tests by hash */
  await (async () => {
    const on_hash_change = async (event) => {
      const path = location.hash ? location.hash.slice(1) : null;
      if (path) {
        await test.import(path);
      }
    };
    window.addEventListener("hashchange", on_hash_change);
    on_hash_change();
  })();

  /* Batch tests */
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      test.import((path) => path.includes("/batch/"));
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
          await test.import(path);
        }
      }
    });
  })();
})();
