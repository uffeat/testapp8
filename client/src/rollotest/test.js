import { Modules } from "@/rollovite/tools/modules.js";

export const test = new Modules(
  "js",
  import.meta.glob([
    "/src/rollotest/tests/**/*.test.js",
    "/src/rollotest/tests/**/*.batch.test.js",
  ]),
  {
    base: "rollotest/tests",
  }
);
