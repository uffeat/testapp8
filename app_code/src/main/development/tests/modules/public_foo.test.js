/*
modules/public_foo
*/

import { modules } from "@/rollovite/modules.js";
import { module } from "@/rollo/tools/module.js";
import { match } from "@/rollo/tools/object/match.js";
import { component } from "@/rollo/component/component.js";

const success = () => console.info("Success!");

/* Set up processor to handle "js from html" */
(() => {
  const cache = {};
  modules.processors.add({
    "js.html": async (path, html) => {
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
    },
  });
})();

export const test_raw_css = async (unit_test) => {
  const actual = await modules.get("/test/foo/foo.css", {raw: true});
  if (!actual.startsWith(".foo")) {
    console.error("Raw css did not import correctly!");
  } else if (unit_test) {
    success();
  }
};

export const test_html = async (unit_test) => {
  const actual = (await modules.get("/test/foo/foo.html")).trim();
  const expected = `<h1>FOO</h1>`;
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_js = async (unit_test) => {
  const actual = (await modules.get("/test/foo/foo.js")).foo;
  const expected = "FOO";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_raw_js = async (unit_test) => {
  const actual = (await modules.get("/test/foo/foo.js", {raw: true})).trim();
  const expected = `export const foo = "FOO";`;
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_json = async (unit_test) => {
  const actual = await modules.get("/test/foo/foo.json");
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
  const actual = (await modules.get("/test/foo/foo.js.html", {format: 'js.html'})).foo;
  const expected = "FOO";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};
