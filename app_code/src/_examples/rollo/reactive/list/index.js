/* Primary purpose: Test and demo of index */
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");

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

  const state = List(["foo", 42, true]);

  test(0, state.index("foo"));
  test(1, state.index(42));
  test(2, state.index(true));
})();
