/*
import { construct } from "@/rolloapp/_tools/construct.js";
20250526
v.1.0
*/


const import_ = Function("path", "return import(path)");

/* Returns js module constructed from text. */
export const construct = async (text) => {
  const url = URL.createObjectURL(
    new Blob([text], {
      type: "text/javascript",
    })
  );
  const module = await import_(url);
  URL.revokeObjectURL(url);
  return module;
};


