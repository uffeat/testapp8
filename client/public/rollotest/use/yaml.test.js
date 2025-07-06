await (async () => {
  const result = (await use("/test/foo/foo.yaml")).foo;
  console.log("result:", result);
})();