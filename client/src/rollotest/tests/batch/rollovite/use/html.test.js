/*
batch/rollovite/use/html
*/

const mode = (test) => (test ? "info" : "error");


/* src html */
await (async () => {
  console[mode((await use("@/test/foo/foo.html")).trim() === `<h1>FOO</h1>`)](
    `Tested src html`
  );
})();


/* public template */
await (async () => {
 console[mode((await use("/test/foo/foo.template")) === `<h1>FOO</h1>`)](
    `Tested public template`
  );
})();


