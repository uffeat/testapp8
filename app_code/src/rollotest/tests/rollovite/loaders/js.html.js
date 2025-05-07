import { modules } from "@/rollovite/modules.js";

modules.src.add(
  import.meta.glob("/src/test/foo/**/*.js.html", {
    import: "default",
    query: "?raw",
  }),
  { raw: "html" }
);