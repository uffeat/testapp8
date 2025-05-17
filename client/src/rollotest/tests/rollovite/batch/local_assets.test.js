/*
rollovite/batch/assets
*/

import { LocalAssets } from "@/rollovite/tools/assets";

/* */
await (async () => {
  const assets = new LocalAssets({ base: "/test", type: "js" });
  console.log("foo:", (await assets.import("foo/foo.js")).foo);
  console.log("foo:", (await assets.$.foo.foo.js).foo);
})();
