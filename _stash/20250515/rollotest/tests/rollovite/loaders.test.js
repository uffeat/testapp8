import { Loaders } from "@/rollovite/tools/loaders.js";

const loaders = Loaders()

loaders.registry
    .add(
      {},
      import.meta.glob("/src/test/**/*.css"),
      import.meta.glob("/src/test/**/*.html", { query: "?raw", import: 'default' }),
      import.meta.glob(["/src/test/**/*.js", "!/src/test/**/*.test.js"]),
      import.meta.glob("/src/test/**/*.json", { import: 'default' })
    )
    .add(
      { raw: true },
      import.meta.glob("/src/test/**/*.css", { query: "?raw", import: 'default' }),
      import.meta.glob("/src/test/**/*.js", { query: "?raw", import: 'default' }),
      import.meta.glob("/src/test/**/*.json", { query: "?raw", import: 'default' })
    )
    .freeze();

  /* Usage */

  await (async function js() {
    /* Import named member of js module */
    console.log("foo:", (await loaders.import("@/test/foo/foo.js")).foo);
    console.log(
      "foo:",
      await loaders.import("@/test/foo/foo.js", { name: "foo" })
    );
    console.log(
      "foo:",
      await loaders.path.test.foo.foo[":js"]({ name: "foo" })
    );
    console.log("raw:", await loaders.import("@/test/foo/foo.js?raw"));
    // Alternatively:
    console.log(
      "raw:",
      await loaders.import("@/test/foo/foo.js", { raw: true })
    );
    console.log("raw:", await loaders.path.test.foo.foo[":js"]({ raw: true }));
  })();

  await (async function json() {
    console.log("parsed:", await loaders.import("@/test/foo/foo.json"));
    console.log("parsed:", await loaders.import("@/test/bar/bar.json"));
    console.log(
      "raw:",
      await loaders.import("@/test/foo/foo.json", { raw: true })
    );
    console.log(
      "raw:",
      await loaders.path.test.foo.foo[":json"]({ raw: true })
    );
    console.log("foo:", (await loaders.import("@/test/foo/foo.json")).foo);
    console.log(
      "foo:",
      await loaders.import("@/test/foo/foo.json", { name: "foo" })
    );
    console.log(
      "foo:",
      await loaders.path.test.foo.foo[":json"]({ name: "foo" })
    );
  })();

  await (async function html() {
    console.log("html:", await loaders.import("@/test/foo/foo.html"));
    console.log("html:", await await loaders.path.test.foo.foo[":html"]());
  })();

  await (async function css() {
    console.log(
      "raw:",
      await loaders.import("@/test/foo/foo.css", { raw: true })
    );
    console.log("raw:", await loaders.path.test.foo.foo[":css"]({ raw: true }));
  })();

  await (async function batch() {
    await loaders.batch((path) => path.includes("/batch/"));
  })();

  (function paths() {
    console.log(
      "paths:",
      loaders.registry.paths((path) => path.includes("bar"))
    );
  })();

  (function size() {
    console.log("size:", loaders.registry.size());
  })();

  await (async function importer() {
    const test = loaders.importer.create("@/test");
    console.log("foo:", await test.import("foo/foo.js", { name: "foo" }));
    console.log("foo:", (await test.path.foo.foo[":js"]()).foo);
  })();

  /* Anti-patterns */
  await (async function anti() {
    /* Will still import raw:*/
    console.log(
      "raw:",
      await loaders.import("@/test/foo/foo.js", { name: "foo", raw: true })
    );

    /* Returns an error: */
    console.log(
      "html:",
      await loaders.import("@/test/foo/foo.html", { raw: true })
    );
  })();