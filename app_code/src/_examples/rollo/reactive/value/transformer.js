/* Primary purpose: Test and demo transformer. 
Also features
- condition */
await (async () => {
  const { Value } = await import("@/rollo/type/types/reactive/value/value");

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

  const state = Value();

  state.condition = (value) => typeof value === "string";
  state.transformer = (value) => value.toUpperCase();

  test("FOO", state.update("foo").$);
  test("BAR", state.update("bar").$);
})();