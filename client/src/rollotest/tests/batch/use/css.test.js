/*
batch/use/css
*/

const mode = (test) => (test ? "info" : "error");



/* src raw */
await (async () => {
  console[
    mode((await use("@/test/foo/foo.css", {raw: true})).trim().startsWith(`.foo`))
  ](`Tested src raw css`);
})();


/* public raw */
await (async () => {
  console[mode((await use("/test/foo/foo.css", {raw: true})).startsWith(`.foo`))](
    `Tested public raw css`
  );
})();




