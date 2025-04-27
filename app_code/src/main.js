

/* NOTE Do NOT await import! */
/* Make a clean distinction between development and production Vite envs */
if (import.meta.env.DEV) {
  import("@/main/development/main.js");
} else {
  import("@/main/production/main.js");
}