/*
import { url } from  "@/rollovite/url.js";
20250513
v.1.0
*/

/* TODO
- Refactor to use a class derived from Base; 
  may need refactoring Base for config without strict type stuff - */

/* Create import maps and related data */
const registry = import.meta.glob(["/src/assets/**/*.*"], {
  query: "?url",
  import: "default",
})



/* Returns environment- and source-adjusted url suitable for e.g., img src 
and link href.
NOTE
- Uses the '@/'-syntax for urls in src and the '/'-syntax for urls in public.
- Returns promise for urls in src, i.e., should be used with await; 
  not the case for urls in public. */
export const url = (path) => {
  if (path.startsWith("@/")) {
    path = `/src/${path.slice("@/".length)}`;
    return registry[path]();
  } else {
    return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
  }
};

