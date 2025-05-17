import { modules } from "@/rollovite/modules.js";

await (async () => {
  console.log("foo:", (await modules.import("@/test/foo/foo.js")).foo);
  console.log("foo:", (await modules.src.test.foo.foo.js).foo);
})();
