/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import "@/rollovite/use.js";


import { Modules } from "@/rollovite/tools/modules.js";

const stuff = new Modules("js", import.meta.glob("/src/test/**/*.js"));
console.log('STUFF...')
console.log("foo:", (await stuff.import("@/test/foo/foo.js")).foo);
console.log("foo:", (await stuff.$.test.foo.foo[":js"]).foo);
console.log("foo:", (await stuff.$.test.foo.foo[":js"]).foo);
await (async function batch() {
  const modules = await stuff.import((specifier) =>
    ["@/test/batch/a.js", "@/test/batch/b.js"].includes(specifier)
  );
  console.log("modules:", modules);
})();

/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
