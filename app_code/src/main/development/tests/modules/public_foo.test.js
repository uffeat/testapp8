/*
modules/public_foo
*/


import { modules } from "@/rollovite/modules.js";
import { module } from "@/rollo/tools/module";


/* Set up loader and processor to handle "js from html" */
(() => {
  modules.loaders.add(
    "js.html",
    import.meta.glob("/src/main/development/tests/modules/foo**/*.js.html", {
      import: "default",
      query: "?raw",
    })
  );

  const cache = {};
  modules.processors.add("js.html", async (path, html) => {
    if (path in cache) {
      return cache[path];
    }
    const element = document.createElement("div");
    element.innerHTML = html;

    const result = await module.from_text(
      element
        .querySelector("template[script]")
        .content.querySelector("script")
        .textContent.trim()
    );
    cache[path] = result;
    return result;
  });
})();

export const test = async (unit_test) => {
  if (!unit_test) return;

 
  console.log("public foo:", (await modules.get("/test/foo.js")).foo);
  console.log("public html:", await modules.get("/test/foo.html"));
  
};