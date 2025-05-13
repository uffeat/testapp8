/*
import { use } from "@/rollovite/use.js";
20250513
v.3.4
*/

const registry = {
  default: import.meta.glob([
    "/src/**/*.css",
    "/src/**/*.js",
    "/src/**/*.json",
    "!/src/rollotest/**/*.*",
  ]),
  raw: import.meta.glob(
    ["/src/**/*.html", "/src/**/*.sheet", "!/src/rollotest/**/*.*"],
    { query: "?raw", import: "default" }
  ),
};

const natives = new Set(["css", "js", "json"]);

export const use = async (path) => {
  const type = path.split(".").reverse()[0];
  path = `/src/${path.slice("@/".length)}`;

  if (natives.has(type)) {
    return await registry.default[path]();
  }

  return await registry.raw[path]();
};
