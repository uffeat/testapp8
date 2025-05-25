/*
main.js
20250520
*/

/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import "@/rollovite/__init__.js";


const { component } = await use("@/rollo/component/component.js");
const { url } = await use("@/rollovite/url.js");




component.h1("foo.bar", { parent: document.body }, "FOO");
await use("/test/bar/bar.css");
console.log('foo:', (await use('/test/foo/foo.js')).foo)
console.log('template:', (await use('/test/foo/foo.template')))

const src = await url("@/images/bevel.jpg")
component.img({ src , parent: document.body });
component.img({ src: "/images/sprocket.jpg", parent: document.body });


/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
