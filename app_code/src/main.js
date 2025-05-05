import { modules } from "@/rollovite/modules.js";

/* NOTE Do NOT await import! */
if (import.meta.env.DEV) {
  import("@/main/development/main.js");
  //modules.get("@/main/development/main.js")

} else {
  import("@/main/production/main.js");
  //modules.get("@/main/production/main.js")
}
