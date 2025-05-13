/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import { use } from  "@/rollovite/use.js";

import { component } from "@/rollo/component/component.js";


component.h1("foo.bar", { parent: document.body }, "FOO");
await use("@/test/foo/foo.css")
console.log("raw css:", (await use("@/test/foo/foo.css?raw")));




console.log("foo:", (await use("@/test/foo/foo.js")).foo);
//console.log("foo:", (await use("/test/foo/foo.js")).foo);
console.log("raw js:", (await use("@/test/foo/foo.js?raw")));
//console.log("raw:", (await use("/test/foo/foo.js?raw")));

console.log("parsed json:", (await use("@/test/foo/foo.json")));
//console.log("json:", (await use("/test/foo/foo.json")));

console.log("raw json:", (await use("@/test/foo/foo.json?raw")));

console.log("html:", (await use("@/test/foo/foo.html")));
//console.log("html:", (await use("/test/foo/foo.template")));

//console.log("foo:", (await use.$.test.foo.foo[':js']).foo);
//console.log("foo:", (await use.$.test.foo.foo[':js']).foo);
//console.log("raw:", (await use.$.test.foo.foo[':js?raw']));
//console.log("bar:", (await use.$.test.bar.bar[':js']).bar);


//console.log("paths:", paths.paths());
//console.log("size:", paths.size());

await (async function batch() {
  await use((path) => path.includes("@/test/batch/"));
  
})();




/* Make 'use' global */
/*
Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: use,
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
