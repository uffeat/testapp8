/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import { url, use } from  "@/rollovite/rollovite.js";

import { component } from "@/rollo/component/component.js";




component.img({src: (await url("@/assets/images/bevel.jpg")), parent: document.body})
component.img({src: (url("/images/sprocket.jpg")), parent: document.body})



console.log("foo:", (await use("@/test/foo/foo.js")).foo);
console.log("foo:", (await use("/test/foo/foo.js")).foo);
console.log("html:", (await use("@/test/foo/foo.html")));
console.log("html:", (await use("/test/foo/foo.template")));

console.log("foo:", (await use.$.test.foo.foo[':js']).foo);
console.log("foo:", (await use.$.test.foo.foo[':js']).foo);
console.log("bar:", (await use.$.test.bar.bar[':js']).bar);


//console.log("paths:", use.paths.paths());
console.log("size:", use.paths.size());

await (async function batch() {
  await use.batch((path) => path.includes("@/test/batch/"));
  
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
