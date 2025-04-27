import { vercel } from "@/rollovercel/vercel.js";

console.log('Vercel environment name:', vercel.environment.NAME)
console.log('Vercel url:', vercel.URL)

/* NOTE Do NOT await import! */
/* Make a clean distinction between development and production Vite envs */
if (import.meta.env.DEV) {
  import("@/main/development/main.js");
} else {
  import("@/main/production/main.js");
}