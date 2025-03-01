/* Primary purpose: Test and demo of union.
Also features
- match */
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");

  const state = List([1, 2, 3]);

  (() => {
    const expected = List([1, 2, 3, 4]);
    const actual = state.union([2, 3, 4]);
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  (() => {
    const expected = List([0, 1, 2, 3, 4]);
    const actual = state.union([0, 4]);
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  (() => {
    const expected = List([1, 2, 3]);
    const actual = state.union([1, 2, 3]);
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  (() => {
    const expected = List([1, 2, 3]);
    const actual = state.union([]);
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();
})();
