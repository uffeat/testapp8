await (async () => {
  const result = await use("/test/foo/foo.md");
  console.log("result:", result);
})();