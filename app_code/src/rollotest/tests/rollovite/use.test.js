import { use } from "@/rollovite/modules.js";
import { is_module } from "@/rollo/tools/is/is_module.js";
import { component } from "@/rollo/component/component.js";

await (async function css() {
  component.h1("foo.bar", { parent: document.body }, "FOO");
  /* src */
  await use("@/test/foo/foo.css");
  /* src raw */
  console.log("raw:", await use("@/test/foo/foo.css", { raw: true }));
  console.log("raw:", await use.src.test.foo.foo[":css"]({ raw: true }));
  /* public */
  await use("/test/bar/bar.css");
  /* public raw */
  console.log("raw:", await use("/test/foo/foo.css", { raw: true }));
  console.log("raw:", await use.public.test.foo.foo[":css"]({ raw: true }));
})();

await (async function js() {
  /* src */
  console.log("module:", await use("@/test/foo/foo.js"));
  console.log("module:", await use.src.test.foo.foo[":js"]());
  /* src member */
  console.log("foo:", (await use("@/test/foo/foo.js")).foo);
  console.log("foo:", await use("@/test/foo/foo.js", { name: "foo" }));
  console.log("foo:", await use.src.test.foo.foo[":js"]({ name: "foo" }));
  /* src raw */
  console.log("raw:", await use("@/test/foo/foo.js", { raw: true }));
  console.log("raw:", await use.src.test.foo.foo[":js"]({ raw: true }));
  /* public */
  console.log("module:", await use("/test/foo/foo.js"));
  console.log("module:", await use.public.test.foo.foo[":js"]());
  /* public member */
  console.log("foo:", (await use("/test/foo/foo.js")).foo);
  console.log("foo:", await use("/test/foo/foo.js", { name: "foo" }));
  console.log("foo:", await use.public.test.foo.foo[":js"]({ name: "foo" }));
  /* public raw */
  console.log("raw:", await use("/test/foo/foo.js", { raw: true }));
  console.log("raw:", await use.public.test.foo.foo[":js"]({ raw: true }));
})();

await (async function json() {
  /* src */
  console.log("parsed:", await use("@/test/foo/foo.json"));
  console.log("parsed:", await use("@/test/bar/bar.json"));
  console.log("parsed:", await use.src.test.foo.foo[":json"]());
  /* src member */
  console.log("foo:", (await use("@/test/foo/foo.json")).foo);
  console.log("foo:", await use("@/test/foo/foo.json", { name: "foo" }));
  console.log("foo:", await use.src.test.foo.foo[":json"]({ name: "foo" }));
  /* src raw */
  console.log("raw:", await use("@/test/foo/foo.json", { raw: true }));
  console.log("raw:", await use.src.test.foo.foo[":json"]({ raw: true }));
  /* public */
  console.log("parsed:", await use("/test/foo/foo.json"));
  console.log("parsed:", await use("/test/bar/bar.json"));
  console.log("parsed:", await use.public.test.foo.foo[":json"]());
  /* public member */
  console.log("foo:", (await use("/test/foo/foo.json")).foo);
  console.log("foo:", await use("/test/foo/foo.json", { name: "foo" }));
  console.log("foo:", await use.public.test.foo.foo[":json"]({ name: "foo" }));
  /* public raw */
  console.log("raw:", await use("/test/foo/foo.json", { raw: true }));
  console.log("raw:", await use.public.test.foo.foo[":json"]({ raw: true }));
})();

await (async function html() {
  /* src */
  console.log("html:", await use("@/test/foo/foo.html"));
  console.log("html:", await await use.src.test.foo.foo[":html"]());
})();

await (async function template() {
  /* public */
  console.log("html:", await use("/test/foo/foo.template"));
  console.log("html:", await await use.public.test.foo.foo[":template"]());
})();

await (async function batch() {
  await use.batch.src((path) => path.includes("@/test/batch/"));
  await use.batch.public((path) => path.includes("/test/batch/"));
})();

await (async function importer() {
  /* src */
  const test = use.importer.src.create("@/test");
  console.log("foo:", await test.import("foo/foo.js", { name: "foo" }));
  console.log("foo:", (await test.path.foo.foo[":js"]()).foo);
})();

await (async function importer() {
  /* public */
  const test = use.importer.public.create("/test");
  console.log("foo:", await test.import("foo/foo.js", { name: "foo" }));
  console.log("foo:", (await test.path.foo.foo[":js"]()).foo);
})();