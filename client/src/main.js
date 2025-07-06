//await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

//const { anvil } = await use("@/rolloanvil/");

await (async () => {
  const result = await use("/test/foo/foo.md");
  console.log("result:", result);
})();

await (async () => {
  const result = (await use("/test/foo/foo.yaml")).foo;
  console.log("result:", result);
})();

await (async () => {
  const result = await use("/test/foo/foo.csv");
  console.log("result:", result);


 
})();
