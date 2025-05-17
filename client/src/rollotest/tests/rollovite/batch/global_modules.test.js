import { modules } from "@/rollovite/modules.js";

await (async () => {
  
  console.log("foo:", (await modules.import("@/test/foo/foo.js")).foo);
 
})();
