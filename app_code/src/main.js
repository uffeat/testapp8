/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import { use } from "@/rollovite/use.js";
import { is_module } from "@/rollo/tools/is/is_module.js";
import { component } from "@/rollo/component/component.js";

import stuff from "@/assets/images/bevel.jpg";
console.log(stuff)

component.img({src: stuff, parent: document.body})



console.log("foo:", (await use("@/test/foo/foo.js")).foo);
console.log("html:", (await use("@/test/foo/foo.html")));


/* Make 'use' global */
Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: use,
});

/* NOTE Do NOT await import! */

/*
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
  */
