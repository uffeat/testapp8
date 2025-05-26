/*
rollovite/modules
*/

import { Modules } from "@/rollovite/modules.js";

/* js */
await (async () => {
  const modules = new Modules(import.meta.glob("/src/test/**/*.js"), {
    base: "@/test",
    type: "js",
  });

  modules.onimport = (result, { owner, path }) => {
    console.log("foo from onimport:", result.foo);
    console.log("path from onimport:", path);
    owner.onimport = null
  };

 
  console.log("foo:", (await modules.import("foo/foo.js")).foo);
})();

/* raw js */
await (async () => {
  const modules = new Modules(
    import.meta.glob("/src/test/**/*.js", {
      query: "?raw",
      import: "default",
    }),
    {
      base: "@/test",
      /* NOTE 'query' could be set; makes no difference here. */
      type: "js",
    }
  );
  console.log("raw:", await modules.import("foo/foo.js"));
})();

/* html */
await (async () => {
  const modules = new Modules(
    import.meta.glob("/src/test/**/*.html", {
      query: "?raw",
      import: "default",
    }),
    {
      base: "@/test",
      /* NOTE 
      'query' could be set (makes no difference here). */
      type: "html",
    }
  );
 
  console.log("html:", await modules.import("foo/foo.html"));
})();

/* batch */
await (async () => {
  const modules = new Modules(import.meta.glob("/src/test/batch/*.js"), {
    base: "@/test/batch",
    onbatch: (imports, { owner }) => {
      console.log(`Imported ${Object.keys(imports).length} modules`);
      owner.onbatch = null;
    },
    type: "js",
  });
  console.log("imported:", await modules.batch());
  console.log("imported:", await modules.batch());
})();

/* process */
await (async () => {
  const modules = new Modules(
    import.meta.glob("/src/test/**/*.js", { query: "?raw", import: "default" }),
    {
      base: "@/test",
      processor: async (result, { path }) => {
        const text = `export const __path__ = "${path}";\n${result}`;
        const url = URL.createObjectURL(
          new Blob([text], { type: "text/javascript" })
        );
        const module = await new Function(`return import("${url}")`)();
        URL.revokeObjectURL(url);
        return module;
      },
      type: "js",
    }
  );
  console.log("__path__:", (await modules.import("foo/foo.js")).__path__);
  console.log("__path__:", (await modules.import("foo/foo.js")).__path__);
})();
