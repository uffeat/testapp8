/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import { marked } from "marked";

import { registry } from "@/rollovite/use.js";

import { component } from "@/rollo/component/component.js";
import { match } from "@/rollo/tools/object/match.js";
import { Modules } from "@/rollovite/tools/modules.js";

import { is_module } from "@/rollo/tools/is/is_module.js";


/* TODO move to main/development/main.js */
import "@/rollometa/init.js";



//registry.processors.add({ html: (result) => `${result}ADDED` });
registry.modules.add(
  new Modules(
    "py",
    import.meta.glob("/src/test/**/*.py", {
      query: "?raw",
      import: "default",
    })
  )
);

registry.modules.add(
  new Modules(
    "md",
    import.meta.glob("/src/test/**/*.md", {
      query: "?raw",
      import: "default",
    }),
    { processor: (result) => marked.parse(result) }
  )
);

const success = () => console.info("Success!");

await (async function md(unit_test) {
  console.log("md -> html:", await use("@/test/foo/foo.md"));
})();

await (async function py(unit_test) {
  console.log("py:", await use("@/test/foo/foo.py"));
})();

await (async function css(unit_test) {
  component.h1("foo.bar", { parent: document.body }, "FOO");
  await use.$.test.foo.foo[":css"];
  await use("/test/bar/bar.css");
})();

await (async function css_raw(unit_test) {
  console.log("raw css:", await use("@/test/foo/foo.css?raw"));
})();

await (async function css(unit_test) {
  console.log("raw css:", await use("@/test/foo/foo.css?raw"));
  console.log("raw css:", await use("/test/foo/foo.css?raw"));
  console.log("raw css:", await use.$.test.foo.foo[":css?raw"]);
  console.log("raw css:", await use.$.test.foo.foo[":css?raw"]);
})();

await (async function html(unit_test) {
  console.log("html:", await use("@/test/foo/foo.html"));
  console.log("html:", await use("/test/foo/foo.template"));
  console.log("html:", await use.$.test.foo.foo[":html"]);
})();

await (async function js(unit_test) {
  console.log("foo:", (await use("@/test/foo/foo.js")).foo);
  console.log("foo:", (await use("/test/foo/foo.js")).foo);
  console.log("Re-exported foo:", (await use("/test/bar/bar.js")).foo);
  console.log("foo:", (await use.$.test.foo.foo[":js"]).foo);
  console.log("foo:", (await use.$.test.foo.foo[":js"]).foo);
  console.log("bar:", (await use.$.test.bar.bar[":js"]).bar);
})();

await (async function js_raw(unit_test) {
  console.log("raw js:", await use("@/test/foo/foo.js?raw"));
  console.log("raw js:", await use("/test/foo/foo.js?raw"));
  console.log("raw js:", await use.$.test.foo.foo[":js?raw"]);
})();

await (async function json(unit_test) {
  console.log("parsed json:", await use("/test/foo/foo.json"));
  console.log("parsed json:", await use("@/test/foo/foo.json"));
  console.log("parsed json:", await use.$.test.bar.bar[":json"]);
})();

await (async function json_raw(unit_test) {
  console.log("raw json:", await use("@/test/foo/foo.json?raw"));
  console.log("raw json:", await use("/test/foo/foo.json?raw"));
  console.log("raw json:", await use.$.test.bar.bar[":json?raw"]);
})();

await (async function batch(unit_test) {
  const modules = await use((specifier) =>
    ["@/test/batch/a.js", "@/test/batch/b.js"].includes(specifier)
  );
  console.log("modules:", modules);
})();

await (async function importer_test(unit_test) {
  /* src */
  const test = use.importer("@/test");
  console.log("foo:", (await test.import("foo/foo.js")).foo);
  console.log("foo:", (await test.path.foo.foo[":js"]).foo);
  console.log("foo:", (await test.path.foo.foo[":js"]).foo);
})();

await (async function importer_test(unit_test) {
  /* public */
  const test = use.importer("/test");
  console.log("foo:", (await test.import("foo/foo.js")).foo);
  console.log("foo:", (await test.path.foo.foo[":js"]).foo);
  console.log("foo:", (await test.path.foo.foo[":js"]).foo);
})();

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
