// import { text_to_module } from "@/tools/text_to_module";
// const { text_to_module } = await import("@/tools/text_to_module");


/* Returns promise resolved to JS module imported from url. 
NOTE
- By-passes Vite's barking at dynamic imports.
- In contrast to the native 'import', 'import_' does (intentionally) NOT cache.
  Any caching should be handled in consuming code. */
export const import_ = (url) => {
  return new Function(`return import("${url}")`)();
};

/* Returns a JS module constructed from text. */
export const text_to_module = async (text) => {
  const blob = new Blob([text], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const module = await import_(url);
  URL.revokeObjectURL(url);
  return module;
};
