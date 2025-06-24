import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import react from "@vitejs/plugin-react";

/* Create __dirname to help aliases work reliably */
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    /* Set base URL for dev and production */
    base: mode === "production" ? "./" : "/",
    define: {
      /* Enable use of import.meta.env.VERCEL_ENV */
      "import.meta.env.VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV),
      /* Enable use of import.meta.env.VERCEL_URL */
      "import.meta.env.VERCEL_URL": JSON.stringify(process.env.VERCEL_URL),
    },
    build: {
      /* Enable /src outside /client */
      //emptyOutDir: true,//

      /* Enable manifest.json generation */
      manifest: true,
      rollupOptions: {
        /* Exclude files from bundle (likely redundant due to treeshaking) */
        //external: (path) => path.endsWith(".test.js"),
      },
      /* Enable features such as top-level await and async imports */
      target: "es2022",
    },
    plugins: [
      tailwindcss(),
      react(),
      //vue(),
      //vueDevTools(),
      
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
