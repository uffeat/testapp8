/*
rollovite/batch/foo_dot
*/

import { modules } from "@/rollovite/modules.js";
import { match } from "@/rollo/tools/object/match.js";
/* Add loader to handle .js.html files */
import "@/rollotest/tests/rollovite/loaders/js.html.js";
/* Set up html_as_js processor */
import "@/rollotest/tests/rollovite/processors/html_as_js.js";

const success = () => console.info("Success!");

export const test_raw_css = async (unit_test) => {
  const actual = await modules.import.src.test.foo.foo.css({ raw: true });
  if (!actual.startsWith(".foo")) {
    console.error("Raw css did not import correctly!");
  } else if (unit_test) {
    success();
  }
};

export const test_js = async (unit_test) => {
  const actual = (await modules.import.src.test.foo.foo.js()).foo;
  const expected = "FOO";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_raw_js = async (unit_test) => {
  const actual = (
    await modules.import.src.test.foo.foo.js({ raw: true })
  ).trim();
  const expected = `export const foo = "FOO";`;
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_html = async (unit_test) => {
  const actual = (await modules.import.src.test.foo.foo.html()).trim();
  const expected = `<h1>FOO</h1>`;
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_json = async (unit_test) => {
  const actual = (await modules.import.src.test.foo.foo.json()).default;
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

export const test_html_as_js = async (unit_test) => {
  const actual = (
    await modules.import.src.test.foo.foo["js:html"]({ format: "html_as_js" })
  ).foo;
  const expected = "FOO";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_template = async (unit_test) => {
  const actual = (await modules.import.src.test.foo.foo.template()).trim();
  const expected = `<h1>FOO</h1>`;
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};
