import { Modules } from "@/rollovite/modules.js";

export const test = new Modules(
  import.meta.glob([
    "/src/rollotest/preview/**/*.test.js",
    "/src/rollotest/vercel/**/*.test.js",
  ]),
  {
    base: "@/rollotest/tests",
    //filter: (path) => path.includes('/preview/') || path.includes('/vercel/'),
    type: "js",
  }
);
