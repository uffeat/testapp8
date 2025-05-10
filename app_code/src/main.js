/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import { modules } from "@/rollovite/modules.js";

/* String syntax */
console.log('foo:', await modules.import('@/test/foo/foo.js', { name: "foo" }))
console.log('foo:', await modules.import('/test/foo/foo.js', { name: "foo" }))
console.log('raw foo:', await modules.import('@/test/foo/foo.js', { raw: true }))
console.log('raw foo:', await modules.import('/test/foo/foo.js', { raw: true }))

/* Python-like syntax */
console.log('foo:', await modules.path.test.foo.foo[":js"]({ name: "foo" }))
console.log('foo:', await modules.path.test.foo.foo[":js"]({ name: "foo" }))
console.log('raw foo:', await modules.path.test.foo.foo[":js"]({ raw: true }))
console.log('raw foo:', await modules.path.test.foo.foo[":js"]({ raw: true }))















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
