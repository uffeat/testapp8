/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import { modules } from "@/rollovite/modules.js";
import { is_module } from "@/rollo/tools/is/is_module.js";
import { component } from "@/rollo/component/component.js";

await (async function css() {
  component.h1("foo.bar", { parent: document.body }, "FOO");
  /* src */
  await modules.import("@/test/foo/foo.css")
  /* src raw */
  console.log(
    "raw:",
    await modules.import("@/test/foo/foo.css", { raw: true })
  );
  console.log("raw:", await modules.src.test.foo.foo[":css"]({ raw: true }));
  /* public */
  await modules.import("/test/bar/bar.css")
  /* public raw */
  console.log(
    "raw:",
    await modules.import("/test/foo/foo.css", { raw: true })
  );
  console.log("raw:", await modules.public.test.foo.foo[":css"]({ raw: true }));
})();

await (async function js() {
  /* src */
  console.log("module:", await modules.import("@/test/foo/foo.js"));
  console.log("module:", await modules.src.test.foo.foo[":js"]());
  /* src member */
  console.log("foo:", (await modules.import("@/test/foo/foo.js")).foo);
  console.log(
    "foo:",
    await modules.import("@/test/foo/foo.js", { name: "foo" })
  );
  console.log("foo:", await modules.src.test.foo.foo[":js"]({ name: "foo" }));
  /* src raw */
  console.log("raw:", await modules.import("@/test/foo/foo.js", { raw: true }));
  console.log("raw:", await modules.src.test.foo.foo[":js"]({ raw: true }));
  /* public */
  console.log("module:", await modules.import("/test/foo/foo.js"));
  console.log("module:", await modules.public.test.foo.foo[":js"]());
  /* public member */
  console.log("foo:", (await modules.import("/test/foo/foo.js")).foo);
  console.log(
    "foo:",
    await modules.import("/test/foo/foo.js", { name: "foo" })
  );
  console.log(
    "foo:",
    await modules.public.test.foo.foo[":js"]({ name: "foo" })
  );
  /* public raw */
  console.log("raw:", await modules.import("/test/foo/foo.js", { raw: true }));
  console.log("raw:", await modules.public.test.foo.foo[":js"]({ raw: true }));
})();

await (async function json() {
  /* src */
  console.log("parsed:", await modules.import("@/test/foo/foo.json"));
  console.log("parsed:", await modules.import("@/test/bar/bar.json"));
  console.log("parsed:", await modules.src.test.foo.foo[":json"]());
  /* src member */
  console.log("foo:", (await modules.import("@/test/foo/foo.json")).foo);
  console.log(
    "foo:",
    await modules.import("@/test/foo/foo.json", { name: "foo" })
  );
  console.log("foo:", await modules.src.test.foo.foo[":json"]({ name: "foo" }));
  /* src raw */
  console.log(
    "raw:",
    await modules.import("@/test/foo/foo.json", { raw: true })
  );
  console.log("raw:", await modules.src.test.foo.foo[":json"]({ raw: true }));
  /* public */
  console.log("parsed:", await modules.import("/test/foo/foo.json"));
  console.log("parsed:", await modules.import("/test/bar/bar.json"));
  console.log("parsed:", await modules.public.test.foo.foo[":json"]());
  /* public member */
  console.log("foo:", (await modules.import("/test/foo/foo.json")).foo);
  console.log(
    "foo:",
    await modules.import("/test/foo/foo.json", { name: "foo" })
  );
  console.log(
    "foo:",
    await modules.public.test.foo.foo[":json"]({ name: "foo" })
  );
  /* public raw */
  console.log(
    "raw:",
    await modules.import("/test/foo/foo.json", { raw: true })
  );
  console.log(
    "raw:",
    await modules.public.test.foo.foo[":json"]({ raw: true })
  );
})();

await (async function html() {
  /* src */
  console.log("html:", await modules.import("@/test/foo/foo.html"));
  console.log("html:", await await modules.src.test.foo.foo[":html"]());
})();

await (async function template() {
  /* public */
  console.log("html:", await modules.import("/test/foo/foo.template"));
  console.log("html:", await await modules.public.test.foo.foo[":template"]());
})();

await (async function batch() {
  await modules.batch.src((path) => path.includes("@/test/batch/"));
  await modules.batch.public((path) => path.includes("/test/batch/"));
})();

await (async function importer() {
  /* src */
  const test = modules.importer.src.create("@/test");
  console.log("foo:", await test.import("foo/foo.js", { name: "foo" }));
  console.log("foo:", (await test.path.foo.foo[":js"]()).foo);
})();

await (async function importer() {
  /* public */
  const test = modules.importer.public.create("/test");
  console.log("foo:", await test.import("foo/foo.js", { name: "foo" }));
  console.log("foo:", (await test.path.foo.foo[":js"]()).foo);
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
