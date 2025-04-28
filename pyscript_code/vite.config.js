import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "PyScriptRuntime",
      fileName: (format) => `pyscript-runtime.${format}.js`,
      formats: ["es"],
    },
    target: "es2022",
    manifest: false,
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
