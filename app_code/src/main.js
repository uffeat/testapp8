/* Globals */
import "@/rollovite/modules.js";
import "@/bootstrap.scss";
//import "@/main.css";
modules.import.src.main.css()



/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
  //modules.import.src.main.production.main.js()
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
