/*
import { url } from  "@/rollovite/url.js";
20250520
v.4.0
*/

/* TODO
- Could be integrated into 'use', e.g., by allowing a '?url' query in paths.
  But probably cleanest to keep separate...
 */

const registry = import.meta.glob(["/src/assets/**/*.*"], {
  query: "?url",
  import: "default",
});

/* Returns environment- and source-adjusted url suitable for e.g., img src 
and link href. 
NOTE
- Scope: 'public' and 'src/assets'. */
export const url = (path) => {
  if (path.startsWith("@/")) {
    path = `/src/assets/${path.slice("@/".length)}`;
    const load = registry[path];
    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }
    /* NOTE 'load' returns a promise; typically call with await */
    return load();
  } else {
    return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
  }
};
