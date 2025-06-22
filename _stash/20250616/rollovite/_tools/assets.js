/*
import { assets } from "@/rollovite/_tools/assets.js";
20250525
v.1.0
*/

/* Do NOT import anything from outside 'rollovite' */

const map = import.meta.glob(["/src/assets/**/*.*"], {
  query: "?url",
  import: "default",
});

/* Returns url from asset in 'assets'. 
NOTE Returns a promise; use with await or then. */
export const assets = (path) => {
  const load = map[`/src/assets/${path}`];
  if (!load) {
    throw new Error(`Invalid path: ${path}`);
  }
  return load();
};


