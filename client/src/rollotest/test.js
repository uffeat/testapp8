import { Modules } from "@/rollovite/tools/modules.js";

export const test = new Modules(
  "js",
  import.meta.glob("/src/rollotest/tests/**/*.test.js"),
  {
    base: 'rollotest/tests',
    processor: async (module) => {
      const tests = Object.values(module);
      for (const test of tests) {
        await test.call?.(this, true);
      }
    },
  }
);
