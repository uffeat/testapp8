/*
import { url } from "@/rollovite/url.js";
20250513
v.1.0
*/

const registry = import.meta.glob(["/src/assets/**/*.*"], {
  query: "?url",
  import: "default",
});

/*
NOTE
-  */
export const url = (path) => {
  if (path.startsWith("@/")) {
    path = `/src/${path.slice("@/".length)}`;
    return registry[path]();
  } else {
    return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
  }
};
