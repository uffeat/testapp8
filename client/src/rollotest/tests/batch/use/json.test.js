/*
batch/use/json
*/

const mode = (test) => (test ? "info" : "error");

/* src */
await (async () => {
  console[mode((await use("@/test/foo/foo.json")).foo === "FOO")](
    `Tested src json`
  );
})();

/* src raw  */
await (async () => {
  console[
    mode(
      (await use("@/test/foo/foo.json", { raw: true })).trim() ===
        `{ "foo": "FOO" }`
    )
  ](`Tested src raw json`);
})();

/* public  */
await (async () => {
  console[mode((await use("/test/foo/foo.json")).foo === "FOO")](
    `Tested public json`
  );
})();

/* public raw  */
await (async () => {
  console[
    mode(
      (await use("/test/foo/foo.json", { raw: true })) === `{ "foo": "FOO" }`
    )
  ](`Tested public raw json`);
})();
