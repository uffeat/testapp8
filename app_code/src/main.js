import { vercel } from "@/rollovercel/vercel.js";
import { anvil } from "@/rolloanvil/anvil.js";



console.log('Vercel environment name:', vercel.environment.NAME)
console.log('Vercel url:', vercel.URL)
console.log('Anvil url:', anvil.URL)

/* NOTE Do NOT await import! */
if (import.meta.env.DEV) {
  import("@/main/development/main.js");
} else {
  import("@/main/production/main.js");
}