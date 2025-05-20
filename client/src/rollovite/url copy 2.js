/*
import { url } from  "@/rollovite/url.js";
20250520
v.1.0
*/

/* Returns environment- and source-adjusted url suitable for e.g., img src 
and link href. */
export const url = (path) => {
  if (path.startsWith("@/")) {
    path = path.slice("@/".length);
    path = `/src/assets/${path}`

   
    return path;
  } else {
    return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
  }
};
