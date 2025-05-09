/*
rollovite/batch/foo
*/

import { modules } from "@/rollovite/modules.js";
import { match } from "@/rollo/tools/object/match.js";

/* Set up html_as_js processor */
import "@/rollotest/tests/rollovite/processors/html_as_js.js";

const success = () => console.info("Success!");

export const test_sheet = async (unit_test) => {
  const actual = await modules.get("@/test/foo/foo.sheet");
  if (!actual.startsWith(".foo")) {
    console.error("sheet did not import correctly!");
  } else if (unit_test) {
    success();
  }
};



export const test_js = async (unit_test) => {
  const actual = (await modules.get("@/test/foo/foo.js")).foo;
  const expected = "FOO";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};


export const test_html = async (unit_test) => {
  const actual = (await modules.get("@/test/foo/foo.html")).trim();
  const expected = `<h1>FOO</h1>`;
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_json = async (unit_test) => {
  const actual = (await modules.get("@/test/foo/foo.json"));
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
    await modules.get("@/test/foo/foo.js.template")
  ).foo;
  const expected = "FOO";
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};

export const test_template = async (unit_test) => {
  const actual = (await modules.get("@/test/foo/foo.template")).trim();
  const expected = `<h1>FOO</h1>`;
  if (actual !== expected) {
    console.error("Expected:", expected, "\nActual:", actual);
  } else if (unit_test) {
    success();
  }
};
