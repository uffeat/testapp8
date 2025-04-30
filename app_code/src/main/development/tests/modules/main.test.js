/*
modules/main
*/

/* TODO
- Move test dirs inside test (except for public) - and refactor loaders to target these */

import { modules } from "@/rollovite/modules.js";
import { module } from "@/rollo/tools/module";

/* Set up support for Vite-native css import */
modules.loaders.add("css", import.meta.glob("/src/rollo/**/*.css"));

/* Set up support for import of css as text */
modules.loaders.add(
  "css?raw",
  import.meta.glob("/src/**/*.css", {
    import: "default",
    query: "?raw",
  })
);

/* Set up support for import of html as text */
modules.loaders.add(
  "html",
  import.meta.glob("/src/**/*.html", {
    import: "default",
    query: "?raw",
  })
);

/* Set up support for Vite-native js module import */
//modules.loaders.add("js", import.meta.glob("/src/**/*.js"));
modules.loaders.add({
  js: import.meta.glob("/src/**/*.js"),
});

/* Set up support for Vite-native json import */
modules.loaders.add("json", import.meta.glob("/src/**/*.json"));

/* Set up support for import of js modules as text */
modules.loaders.add(
  "js?raw",
  import.meta.glob("/src/**/*.js", {
    import: "default",
    query: "?raw",
  })
);

/* Set up loader and processor to handle "js from html" */
(() => {
  modules.loaders.add(
    "js.html",
    import.meta.glob("/src/**/*.js.html", {
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
  console.log("css:", await modules.get("@/rollo/foo/foo.css?raw"));
  console.log(
    (await modules.get("@/rollo/tools/text/case.js")).camel_to_kebab("uffeArlo")
  );
  console.log(
    "case.js as text:",
    await modules.get("@/rollo/tools/text/case.js?raw")
  );
  console.log("html:", await modules.get("@/rollo/foo/foo.html"));
  console.log("json:", (await modules.get("@/rollo/foo/foo.json")).default);
  console.log("foo:", (await modules.get("@/rollo/foo/foo.js.html")).foo);
  console.log("public foo:", (await modules.get("/foo.js")).foo);
  console.log("public html:", await modules.get("/foo.html"));
  console.log("modules.loaders.has('js'):", modules.loaders.has("js"));
  console.log("modules.loaders.has('foo'):", modules.loaders.has("foo"));
  console.log(
    "modules.loaders.has('js', '@/rollo/foo/foo.js'):",
    modules.loaders.has("js", "@/rollo/foo/foo.js")
  );
};
