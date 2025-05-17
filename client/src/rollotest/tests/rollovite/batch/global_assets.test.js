/*
rollovite/batch/global_assets
*/

import { assets } from "@/rollovite/tools/assets";



/* */
await (async () => {
  console.log("foo:", (await assets.import("/test/foo/foo.js")).foo);
  console.log("foo:", (await assets.$.test.foo.foo.js).foo);
})();

