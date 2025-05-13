import { paths, use } from  "@/rollovite/rollovite.js";

import { component } from "@/rollo/component/component.js";






console.log("foo:", (await use("@/test/foo/foo.js")).foo);
console.log("foo:", (await use("/test/foo/foo.js")).foo);
console.log("raw:", (await use("@/test/foo/foo.js?raw")));
console.log("raw:", (await use("/test/foo/foo.js?raw")));

console.log("json:", (await use("@/test/foo/foo.json")));
console.log("json:", (await use("/test/foo/foo.json")));

console.log("html:", (await use("@/test/foo/foo.html")));
console.log("html:", (await use("/test/foo/foo.template")));

console.log("foo:", (await use.$.test.foo.foo[':js']).foo);
console.log("foo:", (await use.$.test.foo.foo[':js']).foo);
console.log("raw:", (await use.$.test.foo.foo[':js?raw']));
console.log("bar:", (await use.$.test.bar.bar[':js']).bar);


//console.log("paths:", paths.paths());
console.log("size:", paths.size());

await (async function batch() {
  await use.batch((path) => path.includes("@/test/batch/"));
  
})();
