/*
batch/rollovite/use/uncached
*/

const test = (...data) => {
  if (data[0] === data[1]) {
    console.log("Success!");
  } else {
    console.error("Error:", data[1]);
  }
};

await (async () => {
  (await use("@/test/bar/bar.js", { cache: false })).bar.bar = null;
  test("BAR", (await use("@/test/bar/bar.js", { cache: false })).bar.bar);
})();

await (async () => {
  (await use("/test/bar/bar.js", { cache: false })).bar.bar = null;
  test("BAR", (await use("/test/bar/bar.js", { cache: false })).bar.bar);
})();


