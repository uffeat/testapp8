/* Primary purpose: Test and demo of intersection. */
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");

  const state = List([1, 2, 3]);

  (() => {
    const expected = List([2, 3]);
    const actual = state.intersection([2, 3, 4]);
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  (() => {
    const other = [4, 5];
    const result = state.intersection(other);
    if (result.length === 0) {
      success();
    } else {
      error([], result);
    }
  })();
})();
