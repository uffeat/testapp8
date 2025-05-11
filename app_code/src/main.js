/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
//import { modules } from "@/rollovite/modules.js";
import { Loaders } from "@/rollovite/tools/loaders.js";

const loaders = Loaders()
  .add(
    {},
    import.meta.glob("/src/test/**/*.css"),
    import.meta.glob("/src/test/**/*.html", { query: "?raw" }),
    import.meta.glob(["/src/test/**/*.js", "!/src/test/**/*.test.js"]),
    import.meta.glob("/src/test/**/*.json")
  )
  .add(
    { raw: true },
    import.meta.glob("/src/test/**/*.css", { query: "?raw" }),
    import.meta.glob("/src/test/**/*.js", { query: "?raw" }),
    import.meta.glob("/src/test/**/*.json", { query: "?raw" })
  )
  .freeze();

//loaders.clear().remove()



await (async function js() {
  /* Import named member of js module */
  console.log("foo:", (await loaders.import("@/test/foo/foo.js")).foo);
  console.log(
    "foo:",
    await loaders.import("@/test/foo/foo.js", { name: "foo" })
  );
  console.log("foo:", await loaders.path.test.foo.foo[":js"]({ name: "foo" }));
  console.log("raw:", await loaders.import("@/test/foo/foo.js?raw"));
  // Alternatively:
  console.log(
    "raw js:",
    await loaders.import("@/test/foo/foo.js", { raw: true })
  );
  console.log("raw js:", await loaders.path.test.foo.foo[":js"]({ raw: true }));
})();

await (async function json() {
  console.log("parsed:", await loaders.import("@/test/foo/foo.json"));
  console.log("parsed:", await loaders.import("@/test/bar/bar.json"));
  console.log(
    "raw:",
    await loaders.import("@/test/foo/foo.json", { raw: true })
  );
  console.log("raw:", await loaders.path.test.foo.foo[":json"]({ raw: true }));
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

/* ANTI-PATTERNS */
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

/* Extras */
console.log("paths:", loaders.paths());
console.log(
  "paths:",
  loaders.paths((path) => path.includes("bar"))
);
console.log("modules:", await loaders.batch());
console.log("copy:", loaders.copy());

/* Importer */
const test = loaders.importer.create("@/test");
console.log("foo:", (await test.import("foo/foo.js")).foo);
console.log("foo:", (await test.path.foo.foo[":js"]()).foo);
// Check that path resets:
console.log("foo:", (await test.path.foo.foo[":js"]()).foo);

/* Make 'modules' global */

/*
Object.defineProperty(window, "modules", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: modules,
});
*/

/* NOTE Do NOT await import! */

/*
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
  */
