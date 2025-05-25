/*
main.js
20250520
*/

/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import "@/rollovite/__init__.js";

const constructed = Function('path', 'return import(path)')

//VERCEL_URL
//BASE_URL
const import_ = async (path) => {
  // NOTE No caching
  //path = `${import.meta.env.VERCEL_URL || ''}${path}`;
  path = import.meta.env.DEV ? path : `.${path.slice('/assets'.length)}`


  const module = await new Function(`return import("${path}")`)();
  return module
}

console.log('foo:', (await import_('/test/foo/foo.js')).foo)



/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
