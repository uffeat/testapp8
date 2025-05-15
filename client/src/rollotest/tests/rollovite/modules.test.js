/*
rollovite/modules
*/

import { Modules } from "@/rollovite/tools/modules.js";

const dong = new Modules("js", import.meta.glob("/src/test/**/*.js"), {base: 'test/foo'});
console.log('DONG...')
console.log("ding:", (await dong.$.ding[":js"]).ding);
console.log("ding:", (await dong.import("ding.js")).ding);





const thing = new Modules("js", import.meta.glob("/src/test/**/*.js"), {base: 'test'});
console.log('THING...')
console.log("foo:", (await thing.import("foo/foo.js")).foo);
console.log("foo:", (await thing.$.foo.foo[":js"]).foo);
console.log("foo:", (await thing.$.foo.foo[":js"]).foo);


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