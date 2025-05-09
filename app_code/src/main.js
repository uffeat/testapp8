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

/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
