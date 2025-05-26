/*
batch/rollovite/use/csv
*/

const test = (...data) => {
  if (data[0] === data[1]) {
    console.log("Success!");
  } else {
    console.error("Error:", data[1]);
  }
};

/* src */
await (async () => {
  (await use("@/test/foo/foo.csv")).data[1][2] = null;
})();

/* src - check mutability protection */
await (async () => {
  test("1-C", (await use("@/test/foo/foo.csv")).data[1][2]);
})();

/* public */
await (async () => {
  test("1-C", (await use("/test/foo/foo.csv")).data[1][2]);
})();
