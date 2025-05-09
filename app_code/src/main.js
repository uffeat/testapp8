/* Globals */
import "@/bootstrap.scss";
import "@/main.css";



import { modules } from "@/rollovite/modules.js";

/* Make 'modules' global */
Object.defineProperty(window, "modules", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: modules,
});



console.log("foo:", await modules.get("@/test/foo/foo.js", { name: "foo" }));
console.log("foo:", await modules.import.src.test.foo.foo[":js"]({ name: "foo" }));
console.log("foo:", await modules.import.public.test.foo.foo[":js"]({ name: "foo" }));
console.log("foo:", await modules.test.foo.foo[":js"]({ name: "foo" }));

console.log("Files in src:", modules.src.paths().length);
console.log("Files in public:", modules.public.paths().length);

/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
