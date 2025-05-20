import { Modules } from "@/rollovite/modules.js";

export const test = new Modules(
  import.meta.glob(["/src/rollotest/**/*.test.js", "!/src/rollotest/vercel/*.test.js"]),
  {
    base: "@/rollotest",
    type: "js",
  }
);
