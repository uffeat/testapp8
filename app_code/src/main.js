import "@/rollovite/modules.js";

console.log('foo:', (await modules.get("@/test/foo/foo.js")).foo)////
console.log('foo:', (await modules.get("/test/foo/foo.js")).foo)////

console.log('foo json:', (await modules.get("@/test/foo/foo.json")))////

/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview")  {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}




