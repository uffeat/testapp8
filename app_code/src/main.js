/* Globals */
import "@/rollovite/modules.js";
import "@/bootstrap.scss";
import "@/main.css";

import { use } from "@/rollovite/use.js";

/* Make use global */
Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: use,
});

console.log('foo:', await use('@/test/foo/foo.js', {name: 'foo'}))
console.log('foo:', await use.test.foo.foo[':js']({name: 'foo'}))

console.log('use.paths:', use.paths)


/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
  
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
