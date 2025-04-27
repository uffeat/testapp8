import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/* Create __dirname to help aliases work reliably */
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    /* Set base URL for dev and production */
    base: mode === "production" ? "./" : "/",
    define: {
      "import.meta.env.VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV),
      "import.meta.env.VERCEL_URL": JSON.stringify(process.env.VERCEL_URL),
    },
    build: {
      //minify: false, //
      //emptyOutDir: true,//
      /* Enable manifest.json generation */
      manifest: true, //
      /* Enable features like top-level await, async imports, and smaller output */
      target: "es2022",
    },
    plugins: [],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
