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
modules.loaders.add("js", import.meta.glob("/src/**/*.js"));

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

/* */
(() => {
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


//console.log(modules.loaders.entries('js'))
