/* Primary purpose: Test and demo of previous.
Also features
- match
*/
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");

  const state = List([1, 2, 3]);
  state.update({ add: [4, 5], remove: [1, 2] });

  (() => {
    const expected = List([1, 2, 3]);
    const actual = state.previous;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  state.remove(3, 4);

  (() => {
    const expected = List([3, 4, 5]);
    const actual = state.previous;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();
})();