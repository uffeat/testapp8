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

console.log("bar:", (await loaders.import("@/test/bar/bar.js")).bar);
console.log("bar:", await loaders.import("@/test/bar/bar.js", { name: "bar" }));
console.log("bar:", await loaders.path.test.bar.bar[":js"]({ name: "bar" }));
// Check that path resets:
console.log("bar:", await loaders.path.test.bar.bar[":js"]({ name: "bar" }));

console.log("raw bar:", await loaders.import("@/test/bar/bar.js?raw"));

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
