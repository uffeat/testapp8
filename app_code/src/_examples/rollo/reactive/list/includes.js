/* Primary purpose: Test and demo of includes */
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

  const state = List([1, 2, 3]);
  /* Standard include */
  test(true, state.includes([1, 2]));
  test(true, state.includes([1, 2, 3]));
  test(false, state.includes([0, 2]));
  /* Switched include */
  test(true, state.includes([1, 2, 3, 4], true));
  test(true, state.includes([1, 2, 3], true));
  test(false, state.includes([0, 2], true));
  test(false, state.includes([0, 2, 3, 4], true));
})();