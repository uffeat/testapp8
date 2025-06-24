/*
batch/use/js
*/

const mode = (test) => (test ? "info" : "error");

/* src */
await (async () => {
  console[mode((await use("@/test/foo/foo.js")).foo === "FOO")](
    `Tested src js`
  );


})();

/* src raw */
await (async () => {
  console[
    mode(
      (await use("@/test/foo/foo.js", { raw: true })).trim() ===
        `export const foo = "FOO";`
    )
  ](`Tested src raw js`);

  
})();

/* public */
await (async () => {
  console[mode((await use("/test/foo/foo.js")).foo === "FOO")](
    `Tested public js`
  );
})();

/* public raw */
await (async () => {
  console[
    mode(
      (await use("/test/foo/foo.js", { raw: true })) ===
        `export const foo = "FOO";`
    )
  ](`Tested public raw js`);
})();
