/*
rollovite/batch/use
*/

const mode = (test) => (test ? "info" : "error");

/* 'use' for js files in src */
await (async () => {
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
})();

/* 'use' for css files in src */
await (async () => {
  console[
    mode((await use("@/test/foo/foo.css?raw")).trim().startsWith(`.foo`))
  ](`Tested src raw css`);
})();

/* 'use' for html files in src */
await (async () => {
  console[mode((await use("@/test/foo/foo.html")).trim() === `<h1>FOO</h1>`)](
    `Tested src html`
  );
})();

/* 'use' for json files in src */
await (async () => {
  console[mode((await use("@/test/foo/foo.json")).foo === "FOO")](
    `Tested src json`
  );

  console[
    mode((await use("@/test/foo/foo.json?raw")).trim() === `{ "foo": "FOO" }`)
  ](`Tested src raw json`);
})();

/* 'use' for public files */
(async () => {
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
})();

// TODO
/* Access to 'use' maps */
await (async () => {
  const map = use.maps
    .get("js")
    .copy((path) => path.includes("/test/"), { format: "map" });
  console.log("map:", map);
})();

// TODO
await (async () => {
  console.log("foo:", await use("@/test/foo/foo.md"));
})();
