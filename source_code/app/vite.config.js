import { defineConfig } from "vite";
import { resolve } from 'path'





export default defineConfig(({ mode }) => {
  return {
    root: resolve(__dirname, 'src'),
    base: mode === "production" ? "./" : "",
    plugins: [
    ],
    build: {
      //minify: false,
      emptyOutDir: true,
      manifest: true,
      //outDir: "../../theme/assets/dist",
      outDir: "../../../production_code",
      // Allow top-level await
      target: ["es2022", "edge89", "firefox89", "chrome89", "safari15"],
      rollupOptions: {
        plugins: [
          
        ],
        output: {
          //entryFileNames: "main.js",
          //assetFileNames: "main.css",
        },
      },
    },
    
  };
});