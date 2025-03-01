/* Primary purpose: Test and demo of forEach. */
await (async () => {
  const { Data } = await import("@/rollo/type/types/reactive/data/data");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");
  const test = (expected, actual) => {
    if (expected === actual) {
      success();
    } else {
      error(expected, actual);
    }
  };

  let actual = 0;
  Data({ a: 1, b: 2, c: 3 }).forEach(([k, v]) => (actual += v));
  test(6, actual);
})();
