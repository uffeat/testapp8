/*
batch/rollovite/use/yaml
*/




const test = (...data) => {
  if (data[0] === data[1]) {
    console.log("Success!");
  } else {
    console.error("Error:", data[1]);
  }
};

await (async () => {
  test("FOO", (await use("@/test/foo/foo.yaml")).foo);
})();




/* public */
await (async () => {
  test("FOO", (await use("/test/foo/foo.yaml")).foo);
})();