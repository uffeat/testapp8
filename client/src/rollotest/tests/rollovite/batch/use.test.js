/*
rollovite/batch/use
*/

const success = () => console.log("Success!");

export default async (unit) => {
  /* src */
  (async function test_js() {
    const actual = (await use("@/test/foo/foo.js")).foo;
    const expected = "FOO";
    if (actual !== expected) {
      console.error("Expected:", expected, "Actual:", actual);
    } else if (unit) {
      success();
    }
  })();

  /* src */
  (async function test_js() {
    const actual = (await use("/test/foo/foo.js")).foo;
    const expected = "FOO";
    if (actual !== expected) {
      console.error("Expected:", expected, "Actual:", actual);
    } else if (unit) {
      success();
    }
  })();

  /* src */
  (async function test_dot() {
    const actual = (await use.$.test.foo.foo[":js"]).foo;
    const expected = "FOO";
    if (actual !== expected) {
      console.error("Expected:", expected, "Actual:", actual);
    } else if (unit) {
      success();
    }
  })();

  /* src */
  (async function test_html() {
    const actual = (await use("@/test/foo/foo.html")).trim();
    const expected = `<h1>FOO</h1>`;
    if (actual !== expected) {
      console.error("Expected:", expected, "Actual:", actual);
    } else if (unit) {
      success();
    }
  })();

  /* public */
  (async function test_template() {
    /* NOTE
    - When importing from public, use 'template' instead of 'html' to avoid 
      script injection by Vercel */
    const actual = await use("/test/foo/foo.template");
    const expected = `<h1>FOO</h1>`;
    if (actual !== expected) {
      console.error("Expected:", expected, "Actual:", actual);
    } else if (unit) {
      success();
    }
  })();

  /* src */
  (async function test_raw() {
    const actual = (await use("@/test/foo/foo.js?raw")).trim();
    const expected = `export const foo = "FOO";`;
    if (actual !== expected) {
      console.error("Expected:", expected, "Actual:", actual);
    } else if (unit) {
      success();
    }
  })();

  /* public */
  (async function test_raw() {
    const actual = await use("/test/foo/foo.js?raw");
    const expected = `export const foo = "FOO";`;
    if (actual !== expected) {
      console.error("Expected:", expected, "Actual:", actual);
    } else if (unit) {
      success();
    }
  })();
};
