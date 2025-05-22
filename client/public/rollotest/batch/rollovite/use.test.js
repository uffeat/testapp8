/*
rollovite/batch/use
*/

(async () => {
  const mode = (test) => (test ? "info" : "error");
  /* src */
  console[
    mode((await use("@/test/foo/foo.css?raw")).trim().startsWith(`.foo`))
  ](`Tested src raw css`);

  console[mode((await use("@/test/foo/foo.html")).trim() === `<h1>FOO</h1>`)](
    `Tested src html`
  );

  console[mode((await use("@/test/foo/foo.js")).foo === "FOO")](
    `Tested src js`
  );

  console[mode((await use.src.test.foo.foo("js")).foo === "FOO")](
    `Tested src js`
  );

  console[
    mode(
      (await use("@/test/foo/foo.js?raw")).trim() ===
        `export const foo = "FOO";`
    )
  ](`Tested src raw js`);

  console[
    mode(
      (await use.src.test.foo.foo("js?raw")).trim() ===
        `export const foo = "FOO";`
    )
  ](`Tested src raw js`);

  console[mode((await use("@/test/foo/foo.json")).foo === "FOO")](
    `Tested src json`
  );

  console[
    mode((await use("@/test/foo/foo.json?raw")).trim() === `{ "foo": "FOO" }`)
  ](`Tested src raw json`);

  /* public */
  console[mode((await use("/test/foo/foo.css?raw")).startsWith(`.foo`))](
    `Tested public raw css`
  );

  console[mode((await use("/test/foo/foo.template")) === `<h1>FOO</h1>`)](
    `Tested public template`
  );

  console[mode((await use("/test/foo/foo.js")).foo === "FOO")](
    `Tested public js`
  );

  console[
    mode((await use("/test/foo/foo.js?raw")) === `export const foo = "FOO";`)
  ](`Tested public raw js`);

  console[mode((await use("/test/foo/foo.json")).foo === "FOO")](
    `Tested public json`
  );

  console[mode((await use("/test/foo/foo.json?raw")) === `{ "foo": "FOO" }`)](
    `Tested public raw json`
  );


  // TODO
  await (async () => {
  console.log("foo:", await use("@/test/foo/foo.md"));
})();
})();
