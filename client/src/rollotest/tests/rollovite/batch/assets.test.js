/*
rollovite/batch/assets
*/


import { Assets } from "@/rollovite/tools/assets";

console.info("Vite environment:", import.meta.env.MODE);



/* */
await (async () => {
  const _assets = new Assets({base: '/test', type: 'js'})
  console.log("foo:", (await _assets.import("foo/foo.js")).foo);
  console.log("foo:", (await _assets.$.foo.foo.js).foo);

  console.log("modules:", await _assets.batch((path) => ["batch/a.js", "batch/b.js"].includes(path)));
})();