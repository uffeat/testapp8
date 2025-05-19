import { Modules } from "@/rollovite/modules.js";

export const test = new Modules(
  import.meta.glob("/src/rollotest/tests/**/*.test.js"),
  {
    base: "@/rollotest/tests",
    type: "js",
  }
);
