/*
main.js
20250520
*/

/* Globals */
//import "@/bootstrap.scss";
import "@/rollolibs/bootstrap/__init__.js";
import "@/main.css";
import "@/rollovite/__init__.js";
import "@/rolloapp/__init__.js";
import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";



/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  console.info("Environment: preview");
  import("@/main/preview.js");
} else {
  console.info("Environment: development");
  import("@/main/development.js");
}
