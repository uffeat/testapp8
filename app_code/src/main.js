/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import { modules } from "@/rollovite/modules.js";


import { Loaders } from "@/rollovite/tools/loaders";

const test = Loaders(import.meta.glob(["/src/test/**/*.js"]),)
console.log('foo:', (await test.import('@/test/foo/foo.js')).foo)
console.log('foo:', (await test.path.test.foo.foo[':js']).foo)
console.log('foo:', (await test.path.test.foo.foo[':js']).foo)
console.log('modules:', (await test.batch()))

const test_importer = test.importer.create('@/test')
console.log('foo:', (await test_importer.import('foo/foo.js')).foo)
console.log('foo:', (await test_importer.path.foo.foo[':js']).foo)
console.log('foo:', (await test_importer.path.foo.foo[':js']).foo)




/* Make 'modules' global */
Object.defineProperty(window, "modules", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: modules,
});

/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
