/*
modules/foo
*/

import { modules } from "@/rollovite/modules.js";
import { module } from "@/rollo/tools/module.js";
import { match } from "@/rollo/tools/object/match.js";
import { component } from "@/rollo/component/component.js";

const success = () => console.info("Success!");

/* Set up support for import of css as text */
modules.loaders.add(
  "css?raw",
  import.meta.glob("/src/main/development/tests/modules/foo/**/*.css", {
    import: "default",
    query: "?raw",
  })
);

/* Set up support for import of html as text */
modules.loaders.add(
  "html",
  import.meta.glob("/src/main/development/tests/modules/foo/**/*.html", {
    import: "default",
    query: "?raw",
  })
);

/* Set up support for Vite-native js module import */
modules.loaders.add({
  js: import.meta.glob("/src/main/development/tests/modules/foo/**/*.js"),
});

/* Set up support for Vite-native json import */
modules.loaders.add(
  "json",
  import.meta.glob("/src/main/development/tests/modules/foo/**/*.json")
);

/* Set up support for import of js modules as text */
modules.loaders.add(
  "js?raw",
  import.meta.glob("/src/main/development/tests/modules/foo**/*.js", {
    import: "default",
    query: "?raw",
  })
);

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
    const element = component.div({ innerHTML: html });
    const result = await module.from_text(
      element
        .querySelector("template[script]")
        .content.querySelector("script")
        .text.trim()
    );
    cache[path] = result;
    return result;
  });
})();

export const test_raw_ccc = async (unit_test) => {
  const actual = await modules.get(
    "@/main/development/tests/modules/foo/foo.css?raw"
  );
  if (!actual.startsWith(".foo")) {
    console.error("Raw css did not import correctly!");
  } else if (unit_test) {
    success();
  }
};

export const test_js = async (unit_test) => {
  const actual = (
    await modules.get("@/main/development/tests/modules/foo/foo.js")
  ).foo;
  const expected = "FOO";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_raw_js = async (unit_test) => {
  const actual = (
    await modules.get("@/main/development/tests/modules/foo/foo.js?raw")
  ).trim();
  const expected = `export const foo = "FOO";`;
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_html = async (unit_test) => {
  const actual = (
    await modules.get("@/main/development/tests/modules/foo/foo.html")
  ).trim();
  const expected = `<h1>FOO</h1>`;
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_json = async (unit_test) => {
  const actual = (
    await modules.get("@/main/development/tests/modules/foo/foo.json")
  ).default;
  const expected = { foo: "FOO" };

  if (!match(actual, expected)) {
    console.error(
      "Expected:",
      JSON.stringify(expected),
      "\nActual:",
      JSON.stringify(actual)
    );
  } else if (unit_test) {
    success();
  }
};

export const test_js_html = async (unit_test) => {
  const actual = (
    await modules.get("@/main/development/tests/modules/foo/foo.js.html")
  ).foo;
  const expected = "FOO";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_meta = (unit_test) => {
  (() => {
    const actual = modules.loaders.has("js");
    const expected = true;
    if (actual !== expected) {
      console.error(`'modules.loaders.has("js")' failed!`);
    } else if (unit_test) {
      success();
    }
  })();

  (() => {
    const actual = modules.loaders.has("foo");
    const expected = false;
    if (actual !== expected) {
      console.error(`'modules.loaders.has("foo")' failed!`);
    } else if (unit_test) {
      success();
    }
  })();

  (() => {
    const actual = modules.loaders.has(
      "js",
      "@/main/development/tests/modules/foo/foo.js"
    );
    const expected = true;
    if (actual !== expected) {
      console.error(
        `'modules.loaders.has("js", "@/main/development/tests/modules/foo/foo.js")' failed!`
      );
    } else if (unit_test) {
      success();
    }
  })();


  console.log(modules.loaders.entries())



};
