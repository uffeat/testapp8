/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
//import { modules } from "@/rollovite/modules.js";
import { assets } from "@/rollovite/tools//public/assets.js";

await (async function css() {
  console.log("css:", await assets.import("/test/foo/foo.css", { raw: true }));
  console.log("css:", await assets.import("/test/foo/foo.css?raw"));
  console.log("css:", await assets.path.test.foo.foo[":css"]({ raw: true }));
  console.log("css:", await assets.path.test.foo.foo[":css"]({ raw: true }));
})();

await (async function js() {
  console.log("foo:", (await assets.import("/test/foo/foo.js")).foo);
  console.log("foo:", await assets.import("/test/foo/foo.js", { name: "foo" }));
  console.log("foo:", await assets.path.test.foo.foo[":js"]({ name: "foo" }));
  console.log("foo:", await assets.path.test.foo.foo[":js"]({ name: "foo" }));
})();

await (async function json() {
  console.log("parsed:", await assets.import("/test/foo/foo.json"));
  console.log(
    "raw:",
    await assets.import("/test/foo/foo.json", { raw: true })
  );
  console.log(
    "raw:",
    await assets.path.test.foo.foo[":json"]({ raw: true })
  );
  console.log("foo:", (await assets.import("/test/foo/foo.json")).foo);
  console.log(
    "foo:",
    await assets.import("/test/foo/foo.json", { name: "foo" })
  );
  console.log(
    "foo:",
    await assets.path.test.foo.foo[":json"]({ name: "foo" })
  );
})();

await (async function template() {
  console.log("foo:", await assets.import("/test/foo/foo.template"));
  console.log("foo:", await assets.path.test.foo.foo[":template"]());
  console.log("foo:", await assets.path.test.foo.foo[":template"]());
})();

await (async function invalid() {
  console.log("invalid:", await assets.import("/blabla.template"));
  console.log("invalid:", (await assets.import("/blabla.js")));
  
})();



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
