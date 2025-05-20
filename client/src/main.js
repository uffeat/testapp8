/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import "@/rollovite/__init__.js";

console.log("foo:", await use("/rollomd/foo/foo.template"));

import { url } from  "@/rollovite/url.js";
import { component } from "@/rollo/component/component.js";




component.img({src: (await url("@/images/bevel.jpg")), parent: document.body})
component.img({src: (url("/images/sprocket.jpg")), parent: document.body})



/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
