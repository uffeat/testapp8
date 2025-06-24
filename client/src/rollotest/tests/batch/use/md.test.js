/*
batch/use/md
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
  test(`<h1>Foo</h1>`, await use("@/test/foo/foo.md"));
})();

/* public */
await (async () => {
  test(`<h1>Foo</h1>`, await use("/test/foo/foo.md"));
})();
