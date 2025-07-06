await (async () => {
  const result = await use("/test/foo/foo.csv");
  console.log("result:", result);
})();