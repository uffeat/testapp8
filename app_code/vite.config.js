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
      /* Enable use of import.meta.env.VERCEL_ENV */
      "import.meta.env.VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV),
      /* Enable use of import.meta.env.VERCEL_URL */
      "import.meta.env.VERCEL_URL": JSON.stringify(process.env.VERCEL_URL),
    },
    build: {
      /* Enable /src outside /app_code */
      //emptyOutDir: true,//

      /* Enable manifest.json generation */
      manifest: true,
      rollupOptions: {
        /* Exclude files from bundle */
        external: (id) =>
          id.includes("/rollotest/") && !id.includes("/vercel/"),
      },
      /* Enable features such as top-level await and async imports */
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
