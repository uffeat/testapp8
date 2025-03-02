import { defineConfig } from "vite";
import { resolve } from "path";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";

export default defineConfig(({ mode }) => {
  return {
    base: mode === "production" ? "./" : "/",  //
    plugins: [],
    build: {
      //minify: false, //
      emptyOutDir: true,
      manifest: true, //
      // Allow top-level await
      //target: ["es2022", "edge89", "firefox89", "chrome89", "safari15"],
      target: 'es2022',
      rollupOptions: {
        plugins: [
          dynamicImportVars({
            warnOnError: true,
          }),
        ],
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
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
