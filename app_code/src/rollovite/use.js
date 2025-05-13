/*
import { use } from "@/rollovite/use.js";
20250513
v.1.0
*/

const config = {
  default: {
    registry: import.meta.glob([
      "/src/**/*.css",
      "/src/**/*.js",
      "/src/**/*.json",
      "!/src/rollotest/**/*.*",
    ]),
    types: new Set(["css", "js", "json"]),
  },
  raw: {
    registry: import.meta.glob(
      ["/src/**/*.html", "/src/**/*.sheet", "!/src/rollotest/**/*.*"],
      { query: "?raw", import: "default" }
    ),
    types: new Set(["html", "sheet"]),
  },

  
};

export const use = async (path) => {
  const type = path.split(".").reverse()[0];
  path = `/src/${path.slice("@/".length)}`;

  if (config.default.types.has(type)) {
    return await config.default.registry[path]();
  }

  if (config.raw.types.has(type)) {
    return await config.raw.registry[path]();
  }

  

  throw new Error(`Invalid path: ${path}`);
};
