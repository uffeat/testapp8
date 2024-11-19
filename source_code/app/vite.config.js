import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  return {
    root: resolve(__dirname, "src"),
    base: mode === "production" ? "./" : "/",
    plugins: [],
    build: {
      //minify: false, // Only use for debug
      emptyOutDir: true,
      outDir: "../dist",
      // Allow top-level await
      target: ["es2022", "edge89", "firefox89", "chrome89", "safari15"],
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, 'src'),
        "component": resolve(__dirname, 'src/utils/component'),
        "components": resolve(__dirname, 'src/components'),
        "htmlx": resolve(__dirname, 'src/built'),
        "utils": resolve(__dirname, 'src/utils'),
      },
    },
  };
});
