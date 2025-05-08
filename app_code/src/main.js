/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import "@/rollovite/modules.js";

//
//
import { component } from "@/rollo/component/component.js";
await modules.get("@/test/foo/foo.css");
await modules.get("/test/bar/bar.css");
component.h1("foo.bar", { parent: document.body }, "Hello");

console.log("html:", await modules.get("@/test/foo/foo.html")); ////

console.log("foo:", (await modules.get("@/test/foo/foo.js", {name: 'foo'}))); ////
//console.log("foo:", (await modules.get("/test/foo/foo.js", {name: 'foo'}))); ////

console.log("json:", await modules.get("@/test/foo/foo.json")); ////
//console.log("json:", await modules.get("/test/foo/foo.json")); ////

console.log("sheet:", await modules.get("@/test/foo/foo.sheet")); ////
//console.log("sheet:", await modules.get("/test/foo/foo.sheet")); ////

console.log("template:", await modules.get("@/test/foo/foo.template")); ////
//console.log("template:", await modules.get("/test/foo/foo.template")); ////

console.log("bar:", await modules.import.src.test.bar.bar.js({name: 'bar'})); ////

//console.log("Number of public files:", modules.public.paths().length); ////
console.log("Number of js files in src:", modules.src.js.paths().length); ////


//
//

/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
