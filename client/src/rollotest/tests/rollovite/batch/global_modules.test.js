import { modules } from "@/rollovite/modules.js";

await (async () => {
  console.log("foo:", (await modules.import("@/test/foo/foo.js")).foo);
  console.log("foo:", (await modules.src.test.foo.foo.js).foo);
})();

await (async () => {
  console.log("foo:", (await modules.import("/test/foo/foo.js")).foo);
  console.log("foo:", (await modules.public.test.foo.foo.js).foo);
})();

await (async () => {
  console.log("paths:", modules.paths(["html", "css"]));
})();
