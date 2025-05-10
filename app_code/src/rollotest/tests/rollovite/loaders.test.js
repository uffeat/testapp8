import { Loaders } from "@/rollovite/tools/loaders.js";

const loaders = Loaders(import.meta.glob(["/src/test/**/*.js"]));
console.log("bar:", (await loaders.import("@/test/bar/bar.js")).bar);
console.log("bar:", await loaders.path.test.bar.bar[":js"]({ name: "bar" }));
// Check that path resets:
console.log("bar:", await loaders.path.test.bar.bar[":js"]({ name: "bar" }));
console.log("paths:", loaders.paths());
console.log(
  "paths:",
  loaders.paths((path) => path.includes("bar"))
);
console.log("modules:", await loaders.batch());
console.log("copy:", loaders.copy());

const test = loaders.importer.create("@/test");
console.log("foo:", (await test.import("foo/foo.js")).foo);
console.log("foo:", (await test.path.foo.foo[":js"]()).foo);
// Check that path resets:
console.log("foo:", (await test.path.foo.foo[":js"]()).foo);