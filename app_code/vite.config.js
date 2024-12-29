import { defineConfig } from "vite";
import { resolve } from "path";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";

export default defineConfig(({ mode }) => {
  return {
    base: mode === "production" ? "./" : "",
    plugins: [],
    build: {
      //minify: false, //
      emptyOutDir: true,
      // Allow top-level await
      target: ["es2022", "edge89", "firefox89", "chrome89", "safari15"],
      rollupOptions: {
        plugins: [
          dynamicImportVars({
            // Raise exception on error
            warnOnError: false,
          }),
        ],
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        components: resolve(__dirname, "src/components"),
        rollo: resolve(__dirname, "src/rollo"),
        rolloui: resolve(__dirname, "src/rolloui"),
      },
    },
  };
});

/*
npm i @rollup/plugin-dynamic-import-vars
npm audit fix
*/
